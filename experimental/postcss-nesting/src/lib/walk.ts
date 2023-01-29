import transformRuleWithinRule from './rule-within-rule.js';
import transformAtruleWithinRule, { isAtruleWithinRule } from './atrule-within-rule.js';
import transformAtruleWithinAtrule, { isAtruleWithinAtrule } from './atrule-within-atrule.js';
import type { Container, Result } from 'postcss';
import { isAtRule, isRule } from './is-type-of-rule.js';

export default function walk(node: Container, result: Result) {
	node.each((child) => {
		const parent = child.parent;

		if (
			isRule(child) &&
			child.selector.trim() &&
			isRule(parent) &&
			parent.selector.trim()
		) {
			transformRuleWithinRule(child, parent, result);
		} else if (
			isAtRule(child) &&
			isRule(parent) &&
			parent.selector.trim() &&
			isAtruleWithinRule(child)
		) {
			transformAtruleWithinRule(child, parent, result, walk);
		} else if (
			isAtRule(child) &&
			isAtRule(parent) &&
			isAtruleWithinAtrule(child, parent)
		) {
			transformAtruleWithinAtrule(child, parent);
		}

		if ('nodes' in child && child.nodes.length) {
			walk(child, result);
		}
	});
}
