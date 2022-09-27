import type { Node } from 'postcss';

export function matchTagName(list: Array<Node>, tagName: string): Array<Node> {
	const filtered = list.filter((node) => {
		return node.type.toLowerCase() === tagName.toLowerCase();
	});

	return filtered;
}
