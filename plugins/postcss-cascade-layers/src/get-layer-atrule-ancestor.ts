import type { AtRule, Node } from 'postcss';

// Returns the first ancestor of the current node that is an @layer rule.
export function getLayerAtRuleAncestor(node: Node): AtRule | null {
	let parent = node.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if ((parent as AtRule).name.toLowerCase() === 'layer') {
			return parent as AtRule;
		}

		parent = parent.parent;
	}

	return null;
}
