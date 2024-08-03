import type valueParser from 'postcss-value-parser';

const IS_INITIAL_REGEX = /^initial$/i;

export function isInitial(parsedValue: valueParser.ParsedValue): boolean {
	const relevantNodes = parsedValue.nodes.filter((node) => node.type !== 'comment' && node.type !== 'space');

	if (relevantNodes.length !== 1) {
		return false;
	}

	return relevantNodes[0].type === 'word' && IS_INITIAL_REGEX.test(relevantNodes[0].value);
}
