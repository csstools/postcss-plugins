import type { NodeList } from '../../node-list';

export function adjacentSiblingCombinator(list: NodeList): NodeList {
	return list.map((node) => {
		return node.prev();
	}).filter((node) => !!node);
}
