import cleanupParent from './cleanup-parent';

export default function shiftNodesBeforeParent(node) {
	const parent = node.parent;
	const index = parent.index(node);

	// conditionally move previous siblings into a clone of the parent
	if (index) {
		const newParent = parent.cloneBefore().removeAll().append(parent.nodes.slice(0, index));
		cleanupParent(newParent);
	}

	// move the current node before the parent (and after the conditional clone)
	parent.before(node);

	return parent;
}
