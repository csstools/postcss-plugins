import type { Node } from 'postcss';

export function adjacentSiblingCombinator(list: Array<Node>): Array<Node> {
	return list.map((node) => {
		return node.prev();
	}).filter((node) => !!node);
}
