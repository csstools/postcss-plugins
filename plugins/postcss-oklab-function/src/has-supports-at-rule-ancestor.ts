import type { Node, AtRule } from 'postcss';

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name === 'supports') {
			if ((parent as AtRule).params.indexOf('oklab(') !== -1) {
				return true;
			}

			if ((parent as AtRule).params.indexOf('oklch(') !== -1) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
