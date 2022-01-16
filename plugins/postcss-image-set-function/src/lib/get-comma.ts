// return whether a node is a valid comma
export function getComma(node) {
	return Object(node).type === 'div' && Object(node).value === ',';
}
