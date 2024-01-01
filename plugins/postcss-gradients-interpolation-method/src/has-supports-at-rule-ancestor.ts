import { GRADIENT_FUNCTION_REGEX } from './is-gradient';
import type { AtRule, Node } from 'postcss';

export function hasSupportsAtRuleAncestor(node: Node): boolean {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name === 'supports' && GRADIENT_FUNCTION_REGEX.test((parent as AtRule).params)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
