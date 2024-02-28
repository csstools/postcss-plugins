import transformRuleWithinRule, { isValidRuleWithinRule } from './rule-within-rule.js';
import transformNestRuleWithinRule, { isValidNestRuleWithinRule } from './nest-rule-within-rule.js';
import transformAtruleWithinRule, { isAtruleWithinRule } from './atrule-within-rule.js';
import transformAtruleWithinAtrule, { isAtruleWithinAtrule } from './atrule-within-atrule.js';
import type { Container, Result } from 'postcss';
import { options } from './options.js';
import { isAtRule, isNestRule, isRule } from './is-type-of-rule.js';

export default function walk(node: Container, result: Result, opts: options) {
	node.each((child) => {
		const parent = child.parent;

		if (isNestRule(child) && !opts.silenceAtNestWarning) {
			node.warn(
				result,
				'`@nest` was removed from the CSS Nesting specification and will be removed from PostCSS Nesting in the next major version.\n' +
				`Change \`@nest ${child.params} {}\` to \`${child.params} {}\` to migrate to the latest standard.`,
			);
		}

		if (
			isRule(child) &&
			isRule(parent) &&
			isValidRuleWithinRule(child)
		) {
			transformRuleWithinRule(child, parent, result, opts);
		} else if (
			isNestRule(child) &&
			isRule(parent) &&
			isValidNestRuleWithinRule(child)
		) {
			transformNestRuleWithinRule(child, parent, result, walk, opts);
		} else if (
			isAtRule(child) &&
			isRule(parent) &&
			isAtruleWithinRule(child)
		) {
			transformAtruleWithinRule(child, parent, result, walk, opts);
		} else if (
			isAtRule(child) &&
			isAtRule(parent) &&
			isAtruleWithinAtrule(child, parent)
		) {
			transformAtruleWithinAtrule(child, parent);
		}

		if ('nodes' in child && child.nodes.length) {
			walk(child, result, opts);
		}
	});
}
