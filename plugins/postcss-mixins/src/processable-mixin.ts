import { isFunctionNode, parseComponentValue } from "@csstools/css-parser-algorithms";
import { tokenize } from "@csstools/css-tokenizer";
import type { AtRule } from "postcss";

const IS_IGNORED_CHILD_RULE = /^(?:apply|contents|result)$/i;

export function processableMixinRule(atRule: AtRule): false | string {
	if (atRule.name.toLowerCase() !== 'mixin') {
		return false;
	}

	if (!atRule.params || !atRule.params.includes('--')) {
		return false;
	}

	if (!atRule.nodes?.length) {
		return false;
	}

	// TODO: support conditional @mixin declarations
	if (atRule.parent !== atRule.root()) {
		return false;
	}

	const nameNode = parseComponentValue(tokenize({
		css: atRule.params,
	}));
	if (!isFunctionNode(nameNode)) {
		return false;
	}

	if (nameNode.value.length) {
		return false;
	}

	// TODO: support @content
	// TODO: support nested @apply
	let hasNestedApplyOrContents = false;
	atRule.walk((x) => {
		if (x.type === 'atrule' && IS_IGNORED_CHILD_RULE.test(x.name)) {
			hasNestedApplyOrContents = true;
		}
	});

	if (hasNestedApplyOrContents) {
		return false;
	}

	return nameNode.getName();
}
