import type { ChildNode, Container } from 'postcss';
import cleanupParent from './cleanup-parent';

export default function shiftNodesBeforeParent(node: ChildNode, parent: Container<ChildNode>) {
	const index = parent.index(node);

	// conditionally move previous siblings into a clone of the parent
	if (index) {
		const newParent = parent.cloneBefore().removeAll().append(parent.nodes.slice(0, index));
		newParent.raws.semicolon = true; /* nested rules end with "}" and do not have this flag set */
		cleanupParent(newParent);
	}

	// move the current node before the parent (and after the conditional clone)
	parent.before(node);
	parent.raws.semicolon = true; /* nested rules end with "}" and do not have this flag set */
}
