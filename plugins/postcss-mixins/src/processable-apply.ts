import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
import { isTokenDelim, isTokenIdent, isTokenOpenCurly, isTokenSemicolon, tokenize } from '@csstools/css-tokenizer';
import type { AtRule } from 'postcss';

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

		const parsedArguments = parseArguments(prelude.value);
		if (!parsedArguments) {
			return false;
		}

		args = parsedArguments;
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

function parseArguments(componentValues: Array<ComponentValue>): false | Array<string> {
	const rawArguments = parseCommaSeparatedListOfComponentValues(componentValues.flatMap((componentValue) => componentValue.tokens()));

	// `--foo()` passes no arguments.
	if (rawArguments.length === 0) {
		return [];
	}

	// `--foo( )` passes no arguments.
	if (rawArguments.length === 1 && isBlank(rawArguments[0])) {
		return [];
	}

	// A final trailing comma does not pass an argument.
	if (isBlank(rawArguments[rawArguments.length - 1])) {
		rawArguments.pop();
	}

	const args: Array<string> = [];

	for (const rawArgument of rawArguments) {
		const meaningful = rawArgument.filter((componentValue) => !isWhiteSpaceOrCommentNode(componentValue));

		let argumentValues: Array<ComponentValue>;
		let argument: string;

		if (meaningful.length === 1 && isSimpleBlockNode(meaningful[0]) && isTokenOpenCurly(meaningful[0].startToken)) {
			// A comma-containing value can be passed as a single argument by wrapping it in `{}`.
			argumentValues = meaningful[0].value;
			argument = stringify([argumentValues]).trim();
		} else {
			// A `{}` wrapper is only allowed as the entire argument.
			if (meaningful.some((componentValue) => isSimpleBlockNode(componentValue) && isTokenOpenCurly(componentValue.startToken))) {
				return false;
			}

			argumentValues = trim(rawArgument);
			argument = stringify([argumentValues]).trim();
		}

		if (hasInvalidDeclarationValue(argumentValues)) {
			return false;
		}

		args.push(argument);
	}

	return args;
}

function trim(componentValues: Array<ComponentValue>): Array<ComponentValue> {
	let start = 0;
	let end = componentValues.length;

	while (start < end && isWhiteSpaceOrCommentNode(componentValues[start])) {
		start++;
	}

	while (end > start && isWhiteSpaceOrCommentNode(componentValues[end - 1])) {
		end--;
	}

	return componentValues.slice(start, end);
}

function isBlank(componentValues: Array<ComponentValue>): boolean {
	return componentValues.every(isWhiteSpaceOrCommentNode);
}

function hasInvalidDeclarationValue(componentValues: Array<ComponentValue>): boolean {
	for (const componentValue of componentValues) {
		if (!isTokenNode(componentValue)) {
			continue;
		}

		if (isTokenSemicolon(componentValue.value)) {
			return true;
		}

		if (isTokenDelim(componentValue.value) && componentValue.value[4].value === '!') {
			return true;
		}
	}

	return false;
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
