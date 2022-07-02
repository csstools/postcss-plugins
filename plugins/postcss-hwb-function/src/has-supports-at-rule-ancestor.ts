import type { Node, AtRule } from 'postcss';

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name.toLowerCase() === 'supports' && (parent as AtRule).params.toLowerCase().indexOf('(color: hwb(0% 0 0))') !== -1) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
