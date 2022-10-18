import type { NodeList } from '../../node-list';

export function matchTagName(list: NodeList, tagName: string): NodeList {
	const filtered = list.filter((node) => {
		return node.type.toLowerCase() === tagName.toLowerCase();
	});

	return filtered;
}
