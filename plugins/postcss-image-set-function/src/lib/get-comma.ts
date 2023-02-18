import valueParser from 'postcss-value-parser';

// return whether a node is a valid comma
export function getComma(node: valueParser.Node) {
	return Object(node).type === 'div' && Object(node).value === ',';
}
