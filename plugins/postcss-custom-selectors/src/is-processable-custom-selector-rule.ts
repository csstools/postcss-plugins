import type { AtRule, ChildNode, Container, Document } from 'postcss';

const allowedParentAtRules = new Set(['scope', 'container', 'layer']);

export function isProcessableCustomSelectorRule(atRule: AtRule): boolean {
	if (atRule.type !== 'atrule') {
		return false;
	}

	if (atRule.name.toLowerCase() !== 'custom-selector') {
		return false;
	}

	if (!atRule.params || !atRule.params.includes(':--')) {
		return false;
	}

	if (atRule.nodes && atRule.nodes.length > 0) {
		return false;
	}

	let parent: Container<ChildNode> | Document | undefined = atRule.parent;
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
