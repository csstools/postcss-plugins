import valueParser, { FunctionNode, Node } from 'postcss-value-parser';
import { Declaration, Result } from 'postcss';
import { pluginOptions } from './index';

export function isVarNode(node: Node) {
	return node.type === 'function' && node.value === 'var';
}

export function validateArgumentsAndTypes(
	node: FunctionNode,
	decl: Declaration,
	result: Result,
	options: pluginOptions,
): valueParser.Dimension[] | undefined {
	const wordNodes = [];
	let hasVars = false;

	node.nodes.forEach(childNode => {
		if (childNode.type === 'word') {
			wordNodes.push(childNode);
			return;
		}

		if (isVarNode(childNode)) {
			hasVars = true;
			return;
		}
	});

	if (hasVars) {
		optionallyWarn(
			decl,
			result,
			`Failed to transform ${ decl.value } as variables can't be processed.`,
			options,
		);
		return;
	}

	if (wordNodes.length !== 2) {
		optionallyWarn(
			decl,
			result,
			`Failed to transform ${ decl.value } as it's expecting 2 arguments instead of ${ wordNodes.length }`,
			options,
		);
		return;
	}

	const valueA = valueParser.unit(wordNodes[0].value);
	const valueB = valueParser.unit(wordNodes[1].value);

	if (!valueA || !valueB) {
		return;
	}

	if (valueA.unit !== valueB.unit) {
		optionallyWarn(
			decl,
			result,
			`Failed to transform ${ decl.value } as the units don't match`,
			options,
		);
		return;
	}

	return [valueA, valueB];
}

export function optionallyWarn(
	decl: Declaration,
	result: Result,
	message: string,
	options: pluginOptions,
) {
	if (options.onInvalid !== 'warn') {
		return;
	}

	decl.warn(result, message);
}

