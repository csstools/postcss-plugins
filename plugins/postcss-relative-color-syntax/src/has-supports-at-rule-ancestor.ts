import type { Node, AtRule } from 'postcss';

const supportsRegex = /(rgb|hsl|hwb|lab|lch|oklch|oklab|color)\(\s*?from/i;

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name.toLowerCase() === 'supports') {
			if (supportsRegex.test((parent as AtRule).params)) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
