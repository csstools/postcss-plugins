import { isFunctionNode, isTokenNode, parseComponentValue } from "@csstools/css-parser-algorithms";
import { isTokenIdent, tokenize } from "@csstools/css-tokenizer";
import type { AtRule } from "postcss";

export const IS_APPLY_REGEX = /^apply$/i;

export function processableApplyRule(atRule: AtRule): false|string {
	if (!atRule.params || !atRule.params.includes('--')) {
		return false;
	}

	if (!isInStyleRule(atRule)) {
		return false;
	}

	// TODO: support @contents
	if (atRule.nodes?.length) {
		return false;
	}

	const nameNode = parseComponentValue(tokenize({
		css: atRule.params,
	}));
	if (isTokenNode(nameNode) && isTokenIdent(nameNode.value)) {
		return nameNode.value[4].value;
	}

	if (!isFunctionNode(nameNode)) {
		return false;
	}

	// TODO: support arguments
	if (nameNode.value.length) {
		return false;
	}

	return nameNode.getName();
}

const IS_SCOPE_REGEX = /^scope$/i;

function isInStyleRule(atRule: AtRule): boolean {
	const parent = atRule.parent;
	if (!parent || parent.type === 'root') {
		return false;
	}

	if (parent.type === 'rule') {
		return true;
	}

	if (parent.type === 'atrule' && IS_SCOPE_REGEX.test(parent.name)) {
		return true;
	}

	return isInStyleRule(parent);
}
