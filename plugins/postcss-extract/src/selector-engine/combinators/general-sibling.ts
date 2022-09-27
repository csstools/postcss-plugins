import type { Node } from 'postcss';

export function generalSiblingCombinator(list: Array<Node>): Array<Node> {
	return list.flatMap((node) => {
		const subList: Array<Node> = [];

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
