import type { Node, AtRule } from 'postcss';

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name === 'supports' && (parent as AtRule).params.toLowerCase().indexOf('(color: rgb(0 0 0 / 0.5)) and (color: hsl(0 0% 0% / 0.5))') !== -1) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
