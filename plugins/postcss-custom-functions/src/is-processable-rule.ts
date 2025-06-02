import type { AtRule, ChildNode, Container, Document } from 'postcss';

const allowedParentAtRules = new Set(['scope', 'container', 'layer']);

export const IS_FUNCTION_REGEX = /^function$/i;

export function isProcessableRule(atRule: AtRule): boolean {
	if (!IS_FUNCTION_REGEX.test(atRule.name)) {
		return false;
	}

	if (!atRule.params || !atRule.params.includes('--')) {
		return false;
	}

	if (!atRule.nodes?.length) {
		return false;
	}

	let parent: Container<ChildNode> | Document | undefined = atRule.parent;
	while (parent) {
		if (parent.type === 'atrule' && !allowedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}
