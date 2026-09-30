import type { AtRule, Node, Rule } from "postcss";

const IS_KEYFRAMES_RULE_REGEX = /^keyframes$/i;
const IS_NESTING_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;
export const IS_PRIVATE_RULE_REGEX = /^private$/i;

export function findStyleRule(node: Node): false|Rule {
	if (!node.parent) {
		return false;
	}

	if (node.parent.type === 'rule') {
		const parent = node.parent as Rule;

		if (parent.parent?.type === 'atrule' && IS_KEYFRAMES_RULE_REGEX.test(parent.parent.name)) {
			return false;
		}

		return parent;
	}

	if (node.parent.type === 'atrule') {
		const parent = node.parent as AtRule;

		if (IS_NESTING_GROUP_RULE_REGEX.test(parent.name)) {
			return findStyleRule(parent);
		}
	}

	return false;
}

export function findAllStyleRules(node: Node): Array<Rule> {
	let focus = node;
	const styleRules: Array<Rule> = [];

	while (true) {
		const styleRule = findStyleRule(focus);
		if (!styleRule) {
			break;
		}

		styleRules.push(styleRule);
		focus = styleRule;
	}

	styleRules.reverse();

	return styleRules;
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
