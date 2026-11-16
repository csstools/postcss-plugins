import { isFunctionNode, isTokenNode, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
import { isTokenIdent } from '@csstools/css-tokenizer';
import type { AtRule, Rule } from 'postcss';
import { parseDashedFunctionArguments } from '@csstools/custom-function-parser';
import { preludeTokens, rawParams } from './utils';

export const IS_APPLY_REGEX = /^apply$/i;

export type ProcessableApply = {
	name: string,
	arguments: Array<string>,
};

export const IS_NESTING_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;
const IS_CSS_WIDE_KEYWORD_REGEX = /^(inherit|initial|unset|revert|revert-layer)$/i;
const IS_KEYFRAMES_REGEX = /^keyframes$/i;

export function processableApplyRule(atRule: AtRule): false | ProcessableApply {
	const styleRule = applySiteRule(atRule);
	if (!styleRule) {
		return false;
	}

	return processableApplyPrelude(atRule);
}

/** The name and arguments of an `@apply` rule, without checking the applying context. */
export function processableApplyPrelude(atRule: AtRule): false | ProcessableApply {
	if (!atRule.params) {
		return false;
	}

	const prelude = parseComponentValue(preludeTokens(rawParams(atRule)));

	let name: string;
	let args: Array<string> = [];

	if (isTokenNode(prelude) && isTokenIdent(prelude.value)) {
		name = prelude.value[4].value;
	} else if (isFunctionNode(prelude)) {
		name = prelude.getName();

		const parsedArguments = parseDashedFunctionArguments(prelude.value);
		if (!parsedArguments) {
			return false;
		}

		args = parsedArguments.map((argument) => stringify([argument]));
	} else {
		return false;
	}

	if (!name.startsWith('--')) {
		return false;
	}

	return {
		name,
		arguments: args,
	};
}

/**
 * Whether an argument is a CSS-wide keyword.
 *
 * Browsers substitute these keywords into the property that uses the parameter,
 * while the specification resolves them in the argument phase.
 * https://drafts.csswg.org/css-mixins-1/#arg-cascade
 */
export function hasCSSWideKeywordArgument(apply: ProcessableApply): boolean {
	return apply.arguments.some(isCSSWideKeyword);
}

/** Whether a value is a single CSS-wide keyword ident, ignoring comments and whitespace. */
function isCSSWideKeyword(value: string): boolean {
	const tokens = preludeTokens(value);

	return tokens.length === 1 && isTokenIdent(tokens[0]) && IS_CSS_WIDE_KEYWORD_REGEX.test(tokens[0][4].value);
}

/**
 * The style rule an `@apply` rule is in, or `null` when the `@apply` is not in a
 * style rule or nested group rule.
 */
export function applySiteRule(atRule: AtRule): Rule | null {
	let parent = atRule.parent;

	while (parent) {
		if (parent.type === 'rule') {
			return isKeyframesRule(parent) ? null : parent;
		}

		if (parent.type !== 'atrule' || !IS_NESTING_GROUP_RULE_REGEX.test(parent.name)) {
			return null;
		}

		parent = parent.parent;
	}

	return null;
}

function isKeyframesRule(rule: AtRule['parent']): boolean {
	let parent = rule?.parent;
	while (parent) {
		if (parent.type === 'atrule' && IS_KEYFRAMES_REGEX.test(parent.name)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
