import type { Node, AtRule } from 'postcss';

export const RGB_HSL_FUNCTION_REGEX = /(?:rgb|hsl)a?\(/i;

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name.toLowerCase() === 'supports') {
			if (RGB_HSL_FUNCTION_REGEX.test((parent as AtRule).params)) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
