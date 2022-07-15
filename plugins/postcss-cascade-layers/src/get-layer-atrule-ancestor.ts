import type { AtRule, Node } from 'postcss';
import { isProcessableLayerRule } from './is-processable-layer-rule';

// Returns the first ancestor of the current node that is an @layer rule.
export function getLayerAtRuleAncestor(node: Node): AtRule | null {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if (isProcessableLayerRule(parent as AtRule)) {
			return parent as AtRule;
		}

		parent = parent.parent;
	}

	return null;
}
