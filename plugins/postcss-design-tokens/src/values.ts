import type { Declaration, Result } from 'postcss';
import valueParser from 'postcss-value-parser';
import { Token, TokenTransformOptions } from './data-formats/base/token';
import { parsedPluginOptions } from './options';

export function onCSSValue(tokens: Map<string, Token>, result: Result, decl: Declaration, opts: parsedPluginOptions) {
	const valueAST = valueParser(decl.value);

	valueAST.walk(node => {
		if (node.type !== 'function' || node.value.toLowerCase() !== opts.valueFunctionName) {
			return;
		}

		if (!node.nodes || node.nodes.length === 0) {
			decl.warn(result, 'Expected at least a single string literal for the design-token function.');
			return;
		}

		if (node.nodes[0].type !== 'string') {
			decl.warn(result, 'Expected at least a single string literal for the design-token function.');
			return;
		}

		const tokenName = node.nodes[0].value;
		const replacement = tokens.get(tokenName);
		if (!replacement) {
			decl.warn(result, `design-token: "${tokenName}" is not configured.`);
			return;
		}

		const remainingNodes = node.nodes.slice(1).filter(x => x.type === 'word');
		if (!remainingNodes.length) {
			node.value = replacement.cssValue();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(node as any).nodes = undefined;
			return;
		}

		const transformOptions: TokenTransformOptions = {
			pluginOptions: opts.unitsAndValues,
		};
		for (let i = 0; i < remainingNodes.length; i++) {
			if (
				remainingNodes[i].type === 'word' &&
				remainingNodes[i].value.toLowerCase() === 'to' &&
				remainingNodes[i + 1] &&
				remainingNodes[i + 1].type === 'word'
			) {
				transformOptions.toUnit = remainingNodes[i + 1].value;
				i++;
			}
		}

		try {
			node.value = replacement.cssValue(transformOptions);
		} catch (err) {
			decl.warn(result, (err as Error).message);
			return;
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(node as any).nodes = undefined;
	});

	return String(valueAST);
}
