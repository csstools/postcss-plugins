import type { AtRule, ChildNode, Container, Document, Rule } from 'postcss';

const allowedParentAtRules = new Set(['layer']);

export function isProcessableRule(rule: Rule): boolean {
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
export const HTML_SELECTOR_REGEXP = /^html$/i;
export const HTML_WHERE_SELECTOR_REGEXP = /^:where\(html\)$/i;
export const ROOT_SELECTOR_REGEXP = /^:root$/i;
export const ROOT_WHERE_SELECTOR_REGEXP = /^:where\(:root\)$/i;
export const MAYBE_HTML_OR_ROOT_RULE_REGEXP = /(html|:root)/i;
