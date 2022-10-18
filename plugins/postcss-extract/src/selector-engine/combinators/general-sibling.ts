import type { NodeList } from '../../node-list';

export function generalSiblingCombinator(list: NodeList): NodeList {
	return list.flatMap((node) => {
		const subList: NodeList = [];

		let prev = node.prev();
		while (prev) {
			subList.push(prev);
			prev = prev.prev();
		}

		if (!list.length) {
			return [];
		}

		return subList;
	}).filter((node) => !!node);
}
