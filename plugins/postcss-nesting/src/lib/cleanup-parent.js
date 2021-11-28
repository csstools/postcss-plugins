export default function cleanupParent(parent) {
	if (!parent.nodes.length) {
		parent.remove();
	}
}
