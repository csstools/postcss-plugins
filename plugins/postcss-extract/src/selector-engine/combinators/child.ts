import type { NodeList } from '../../node-list';

export function childCombinator(list: NodeList): NodeList {
	return list.map((node) => {
		return node.parent;
	}).filter((node) => !!node);
}
