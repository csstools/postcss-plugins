import transformRuleWithinRule from './rule-within-rule.js';
import transformAtruleWithinRule, { isAtruleWithinRule } from './atrule-within-rule.js';
import transformAtruleWithinAtrule, { isAtruleWithinAtrule } from './atrule-within-atrule.js';
import type { Container } from 'postcss';
import { isAtRule, isRule } from './is-type-of-rule.js';

export default function walk(node: Container) {
	node.each((child) => {
		const parent = child.parent;

		if (
			isRule(child) &&
			isRule(parent)
		) {
			transformRuleWithinRule(child, parent);
		} else if (
			isAtRule(child) &&
			isRule(parent) &&
			isAtruleWithinRule(child)
		) {
			transformAtruleWithinRule(child, parent, walk);
		} else if (
			isAtRule(child) &&
			isAtRule(parent) &&
			isAtruleWithinAtrule(child, parent)
		) {
			transformAtruleWithinAtrule(child, parent);
		}

		if ('nodes' in child && child.nodes.length) {
			walk(child);
		}
	});
}
