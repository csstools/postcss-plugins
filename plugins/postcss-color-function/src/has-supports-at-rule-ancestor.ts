import type { Node, AtRule } from 'postcss';

export const atSupportsParams = '(color: color(display-p3 1 1 1))';

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name === 'supports' && (parent as AtRule).params.indexOf(atSupportsParams) !== -1) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
