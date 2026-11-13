import { isFunctionNode, isTokenNode, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
import { isTokenIdent, tokenize } from '@csstools/css-tokenizer';
import type { AtRule } from 'postcss';
import { parseDashedFunctionArguments } from '@csstools/custom-function-parser';

export const IS_APPLY_REGEX = /^apply$/i;

export type ProcessableApply = {
	name: string,
	arguments: Array<string>,
};

const IS_NESTING_GROUP_RULE_REGEX = /^(container|layer|media|scope|starting-style|supports)$/i;
const IS_KEYFRAMES_REGEX = /^keyframes$/i;

export function processableApplyRule(atRule: AtRule): false | ProcessableApply {
	if (!atRule.params || !atRule.params.includes('--')) {
		return false;
	}

	if (!isInStyleRule(atRule)) {
		return false;
	}

	const prelude = parseComponentValue(tokenize({
		css: atRule.params,
	}));

	let name: string;
	let args: Array<string> = [];

	if (isTokenNode(prelude) && isTokenIdent(prelude.value)) {
		name = prelude.value[4].value;
	} else if (isFunctionNode(prelude)) {
		name = prelude.getName();

		const parsedArguments = parseDashedFunctionArguments(prelude);
		if (!parsedArguments) {
			return false;
		}

		args = parsedArguments.map((argument) => stringify([argument]).trim());
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

function isInStyleRule(atRule: AtRule): boolean {
	let parent = atRule.parent;

	while (parent) {
		if (parent.type === 'rule') {
			return !isKeyframesRule(parent);
		}

		if (parent.type !== 'atrule' || !IS_NESTING_GROUP_RULE_REGEX.test(parent.name)) {
			return false;
		}

		parent = parent.parent;
	}

	return false;
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
