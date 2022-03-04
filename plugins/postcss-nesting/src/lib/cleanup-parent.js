export default function cleanupParent(parent) {
	if (!parent.nodes.length) {
		parent.remove();
		return;
	}

	const commentNodes = parent.nodes.filter(node => node.type === 'comment');
	if (commentNodes.length === parent.nodes.length) {
		parent.replaceWith(...commentNodes);
	}
}
