import type { Node } from 'postcss';

export function childCombinator(list: Array<Node>): Array<Node> {
	return list.map((node) => {
		return node.parent;
	}).filter((node) => !!node);
}
