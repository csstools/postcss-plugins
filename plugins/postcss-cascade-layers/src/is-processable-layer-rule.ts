import type { AtRule, ChildNode, Container, Document } from 'postcss';

const allowedParentAtRules = new Set(['layer', 'supports', 'media', 'container', 'scope']);

export function isProcessableLayerRule(atRule: AtRule): boolean {
	if (atRule.type !== 'atrule') {
		return false;
	}

	if (atRule.name.toLowerCase() !== 'layer') {
		return false;
	}

	let parent : Container<ChildNode>|Document = atRule.parent;
	while (parent) {
		if (parent.type === 'rule') {
			return false;
		}

		if (parent.type === 'atrule' && !allowedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}
