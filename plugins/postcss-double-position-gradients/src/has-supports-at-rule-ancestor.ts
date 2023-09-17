import type { AtRule, Node } from 'postcss';
import { HAS_GRADIENT_FUNCTION } from './is-gradient';

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name.toLowerCase() === 'supports' && HAS_GRADIENT_FUNCTION.test((parent as AtRule).params)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
