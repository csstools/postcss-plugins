import type { Node } from 'postcss';

export function descendantCombinator(list: Array<Node>): Array<Node> {
	return list.flatMap((node) => {
		const subList: Array<Node> = [];

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
