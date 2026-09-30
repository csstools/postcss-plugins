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

// Conditional group rules that are allowed within a `@function` body.
const conditionalGroupRules = new Set(['media', 'supports', 'container', 'starting-style']);

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

	// The body of a `@function` rule accepts declarations and conditional group
	// rules. Anything else makes the rule invalid.
	if (!hasValidBody(atRule)) {
		return false;
	}

	let parent: Container<ChildNode> | Document | undefined = atRule.parent;
	while (parent) {
		if (parent.type === 'rule') {
			// `@function` is not allowed inside a style rule.
			return false;
		}

		if (parent.type === 'atrule' && !allowedParentAtRules.has((parent as AtRule).name.toLowerCase())) {
			return false;
		}

		parent = parent.parent;
	}

	return true;
}

/**
 * Whether the definition is inside a `@layer` that is itself inside a
 * conditional group rule.
 *
 * Such a layer is only created when the condition matches, so its position in
 * the global layer order can not be determined. Definitions of the same name
 * may resolve differently, so the whole name is unsupported.
 */
export function isInConditionalLayer(atRule: AtRule): boolean {
	let parent: Container<ChildNode> | Document | undefined = atRule.parent;
	while (parent) {
		if (parent.type === 'atrule' && (parent as AtRule).name.toLowerCase() === 'layer') {
			return layerIsConditional(parent as AtRule);
		}

		parent = parent.parent;
	}

	return false;
}

function hasValidBody(atRule: AtRule): boolean {
	return (atRule.nodes || []).every(isAllowedBodyNode);
}

function isAllowedBodyNode(node: ChildNode): boolean {
	if (node.type === 'decl' || node.type === 'comment') {
		return true;
	}

	if (node.type === 'atrule') {
		return conditionalGroupRules.has(node.name.toLowerCase()) && !!node.nodes && hasValidBody(node);
	}

	return false;
}

function layerIsConditional(layerNode: AtRule): boolean {
	let parent: Container<ChildNode> | Document | undefined = layerNode.parent;
	while (parent) {
		if (parent.type === 'atrule' && conditionalGroupRules.has((parent as AtRule).name.toLowerCase())) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
