import type { ChildNode, Container } from 'postcss';

export default function cleanupParent(parent: Container<ChildNode>) {
	if (!parent.nodes.length) {
		parent.remove();
		return;
	}

	const commentNodes = parent.nodes.filter(node => node.type === 'comment');
	if (commentNodes.length === parent.nodes.length) {
		parent.replaceWith(...commentNodes);
	}
}
