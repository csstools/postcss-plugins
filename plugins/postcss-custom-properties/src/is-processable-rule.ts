import type { AtRule, ChildNode, Container, Document, Rule } from 'postcss';

const allowedParentAtRules = new Set(['layer']);

export function isProcessableRule(rule: Rule): boolean {
	if (!isHtmlRule(rule) && !isRootRule(rule)) {
		return false;
	}

	let parent: Container<ChildNode> | Document | undefined = rule.parent;
	while (parent) {
		if (parent.type === 'atrule' && !allowedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}

// match html and :root rules
const htmlSelectorRegExp = /^html$/i;
const rootSelectorRegExp = /^:root$/i;

export function isHtmlRule(rule: Rule) {
	return rule.selectors.some(item => htmlSelectorRegExp.test(item)) && rule.nodes && rule.nodes.length;
}

export function isRootRule(rule: Rule) {
	return rule.selectors.some(item => rootSelectorRegExp.test(item)) && rule.nodes && rule.nodes.length;
}
