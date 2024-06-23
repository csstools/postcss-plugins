import type { ChildNode, Container, Document } from 'postcss';
import type { NodeList } from '../../node-list';

export function childCombinator(list: NodeList): Array<Container<ChildNode> | Document> {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	return list.map((node) => {
		return node.parent;
	}).filter((node) => !!node) as Array<Container<ChildNode> | Document>;
}
