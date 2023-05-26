import type { Node, AtRule } from 'postcss';

const supportsCheck = /(\(color: rgb(a?)\(0 0 0 \/ 0)|(\(color: hsl(a?)\(0 0% 0% \/ 0)/i;

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name === 'supports' && supportsCheck.test((parent as AtRule).params)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
