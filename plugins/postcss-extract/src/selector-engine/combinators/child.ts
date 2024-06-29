import type { ChildNode, Container, Document } from 'postcss';
import type { NodeList } from '../../node-list';

export function childCombinator(list: NodeList): Array<Container<ChildNode> | Document> {
	return list.map((node) => {
		return node.parent;
	}).filter((node): node is Container<ChildNode> | Document => {
		return !!node;
	});
}
