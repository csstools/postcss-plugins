import type { Node, AtRule } from 'postcss';

const HAS_COLOR_GAMUT = /\bcolor-gamut\b/i;

export function hasConditionalAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if (
			(parent as AtRule).name.toLowerCase() === 'media' &&
			HAS_COLOR_GAMUT.test((parent as AtRule).params)
		) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
