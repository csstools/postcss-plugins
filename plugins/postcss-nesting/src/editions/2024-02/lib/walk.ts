import type { Container, Result } from 'postcss';
import transformAtruleWithinRule, { isAtruleWithinRule } from './atrule-within-rule.js';
import transformRuleWithinRule, { isValidRuleWithinRule } from './rule-within-rule.js';
import { isAtRule, isRule } from '../../shared/lib/is-type-of-rule.js';

export default function walk(node: Container, result: Result): void {
	node.each((child) => {
		const parent = child.parent;

		if (
			isRule(child) &&
			isRule(parent) &&
			isValidRuleWithinRule(child)
		) {
			transformRuleWithinRule(child, parent, result);
		} else if (
			isAtRule(child) &&
			isRule(parent) &&
			isAtruleWithinRule(child)
		) {
			transformAtruleWithinRule(child, parent, result, walk);
		}

		if ('nodes' in child && child.nodes.length) {
			walk(child, result);
		}
	});
}
