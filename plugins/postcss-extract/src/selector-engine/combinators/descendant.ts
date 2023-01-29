import type { NodeList } from '../../node-list';

export function descendantCombinator(list: NodeList): NodeList {
	return list.flatMap((node) => {
		const subList: NodeList = [];

		let parent = node.parent;
		while (parent) {
			subList.push(parent);
			parent = parent.parent;
		}

		if (!list.length) {
			return [];
		}

		return subList;
	}).filter((node) => !!node);
}
