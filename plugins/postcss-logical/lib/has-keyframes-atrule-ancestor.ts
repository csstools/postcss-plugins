import type { Node, Container, Document, AtRule } from 'postcss';
export function hasKeyframesAtRuleAncestor(node : Node) : boolean {
	let parent: Container | Document = node.parent;

	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((node.parent as AtRule).name.toLowerCase() === 'keyframes') {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
