import type { Node, AtRule } from 'postcss';

const HAS_IC_DECLARATION_REGEX = /\(font-size: \d+ic\)/i;

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name.toLowerCase() === 'supports') {
			if (HAS_IC_DECLARATION_REGEX.test((parent as AtRule).params)) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
