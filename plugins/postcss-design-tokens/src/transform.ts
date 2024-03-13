import { ComponentValue, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import type { Node, Result } from 'postcss';
import { Token, TokenTransformOptions } from './data-formats/base/token';
import { parsedPluginOptions } from './options';
import { parseComponentValues } from './parse-component-values';

export function transform(tokens: Map<string, Token>, result: Result, postCSSNode: Node, source: string, opts: parsedPluginOptions): string {
	const componentValues = parseComponentValues(source);

	let didChangeSomething = false;
	componentValues.forEach((componentValue, index) => {
		if (!('walk' in componentValue)) {
			return;
		}

		{
			const replacements = transformComponentValue(componentValue, tokens, result, postCSSNode, opts);
			if (replacements) {
				componentValues.splice(index, 1, ...replacements);
				didChangeSomething = true;
				return false;
			}
		}

		componentValue.walk((entry, nodeIndex) => {
			if (typeof nodeIndex === 'string') {
				// Should never happen in FunctionNode
				return;
			}

			const replacements = transformComponentValue(entry.node, tokens, result, postCSSNode, opts);
			if (replacements) {
				entry.parent.value.splice(nodeIndex, 1, ...replacements);
				didChangeSomething = true;
				return false;
			}
		});
	});

	if (!didChangeSomething) {
		return source;
	}

	return componentValues.map((x) => x.toString()).join('');
}


function transformComponentValue(node: ComponentValue, tokens: Map<string, Token>, result: Result, postCSSNode: Node, opts: parsedPluginOptions): Array<ComponentValue> | undefined {
	if (!isFunctionNode(node)) {
		return;
	}

	if (node.getName().toLowerCase() !== opts.valueFunctionName) {
		return;
	}

	let tokenName = '';
	let operator = '';
	let operatorSubject = '';

	for (let i = 0; i < node.value.length; i++) {
		const subValue = node.value[i];
		if (isWhitespaceNode(subValue) || isCommentNode(subValue)) {
			continue;
		}

		if (
			!tokenName &&
			isTokenNode(subValue) &&
			subValue.value[0] === TokenType.String
		) {
			tokenName = subValue.value[4].value;
			continue;
		}

		if (
			tokenName &&
			!operator &&
			isTokenNode(subValue) &&
			subValue.value[0] === TokenType.Ident &&
			subValue.value[4].value.toLowerCase() === 'to'
		) {
			operator = 'to';
			continue;
		}

		if (
			tokenName &&
			operator &&
			isTokenNode(subValue) &&
			subValue.value[0] === TokenType.Ident
		) {
			operatorSubject = subValue.value[4].value;
			continue;
		}

		break;
	}

	if (!tokenName) {
		postCSSNode.warn(result, 'Expected at least a single string literal for the design-token function.');
		return;
	}

	const replacement = tokens.get(tokenName);
	if (!replacement) {
		postCSSNode.warn(result, `design-token: "${tokenName}" is not configured.`);
		return;
	}

	if (!operator) {
		return parseComponentValues(replacement.cssValue());
	}

	const transformOptions: TokenTransformOptions = {
		pluginOptions: opts.unitsAndValues,
	};

	if (operator === 'to') {
		if (!operatorSubject) {
			postCSSNode.warn(result, `Invalid or missing unit in "${node.toString()}"`);
			return;
		}

		transformOptions.toUnit = operatorSubject;

		try {
			return parseComponentValues(replacement.cssValue(transformOptions));
		} catch (err) {
			postCSSNode.warn(result, (err instanceof Error) ? err.message : String(err));
			return;
		}
	}
}
