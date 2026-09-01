import type { AtRule, Rule } from "postcss";

const IS_KEYFRAMES_RULE_REGEX = /^keyframes$/i;
const IS_NESTING_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;
export const IS_PRIVATE_RULE_REGEX = /^private$/i;

export function findStyleRule(atRule: AtRule): false|Rule {
	if (!atRule.parent) {
		return false;
	}

	if (atRule.parent.type === 'rule') {
		if (atRule.parent.parent?.type === 'atrule' && IS_KEYFRAMES_RULE_REGEX.test(atRule.parent.parent?.name)) {
			return false;
		}

		return atRule.parent;
	}

	if (atRule.parent.type === 'atrule' && IS_NESTING_GROUP_RULE_REGEX.test(atRule.parent.name)) {
		return findStyleRule(atRule.parent);
	}

	return false;
}

export function findPrivateRule(atRule: AtRule): false | AtRule {
	if (atRule.parent?.type !== 'atrule') {
		return false;
	}

	if (IS_NESTING_GROUP_RULE_REGEX.test(atRule.parent.name)) {
		return findPrivateRule(atRule.parent);
	}

	if (IS_PRIVATE_RULE_REGEX.test(atRule.parent.name)) {
		return atRule.parent;
	}

	return false;
}
