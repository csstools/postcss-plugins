import type { Container, Result } from 'postcss';
import transformAtruleWithinRule, { isAtruleWithinRule } from './atrule-within-rule.js';
import transformRuleWithinRule, { isValidRuleWithinRule } from './rule-within-rule.js';
import { isAtRule, isRule } from '../../shared/lib/is-type-of-rule.js';

// Guard against unbounded recursion on deeply nested input.
const MAX_NESTING_DEPTH = 512;

export default function walk(node: Container, result: Result, depth: number = 0): void {
	if (depth >= MAX_NESTING_DEPTH) {
		throw new Error(`Maximum nesting depth of ${MAX_NESTING_DEPTH} exceeded while resolving nested rules.`);
	}

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
			transformAtruleWithinRule(child, parent, result, walk, depth + 1);
		}

		if ('nodes' in child && child.nodes.length) {
			walk(child, result, depth + 1);
		}
	});
}
