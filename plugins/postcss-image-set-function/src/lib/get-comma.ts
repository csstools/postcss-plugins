// return whether a node is a valid comma
export function getComma(node) {
	return Object(node).type === 'punctuation' && Object(node).value === ',';
}
