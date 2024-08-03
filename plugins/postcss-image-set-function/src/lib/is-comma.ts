import type valueParser from 'postcss-value-parser';

// return whether a node is a valid comma
export function isComma(node?: valueParser.Node): boolean {
	return !!node && node.type === 'div' && node.value === ',';
}
