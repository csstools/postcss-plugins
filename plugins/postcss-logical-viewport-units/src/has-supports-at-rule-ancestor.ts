import type { Node, AtRule } from 'postcss';
import { hasFeature } from './has-feature';

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name.toLowerCase() === 'supports') {
			if (hasFeature((parent as AtRule).params)) {
				return true;
			}
		}

		parent = parent.parent;
	}

	return false;
}
