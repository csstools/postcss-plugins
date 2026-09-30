import type { AtRule, ChildNode, Container, Document } from 'postcss';

// `@function` definitions may appear inside cascade layers and inside
// conditional group rules. Dynamic conditional rules are handled by emitting a
// guarded result per definition.
//
// Excluded on purpose:
// - `@container`: browsers currently ignore the container condition on
//   `@function` definitions, so a spec correct transformation would not match
//   the browser.
// - `@scope`: tree-scoped, it changes where the name resolves rather than just
//   whether the definition is active.
// - `@starting-style`: first style update only.
const allowedParentAtRules = new Set(['layer', 'media', 'supports']);

const IS_FUNCTION_REGEX = /^function$/i;

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
