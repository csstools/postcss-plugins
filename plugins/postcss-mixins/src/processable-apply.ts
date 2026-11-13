import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
import { isTokenIdent, isTokenOpenCurly, tokenize } from '@csstools/css-tokenizer';
import type { AtRule } from 'postcss';

export const IS_APPLY_REGEX = /^apply$/i;

export type ProcessableApply = {
	name: string,
	arguments: Array<string>,
};

const IS_IMPORTANT_REGEX = /!\s*important/i;

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

		let argument: string;

		if (meaningful.length === 1 && isSimpleBlockNode(meaningful[0]) && isTokenOpenCurly(meaningful[0].startToken)) {
			// A comma-containing value can be passed as a single argument by wrapping it in `{}`.
			argument = stringify([meaningful[0].value]).trim();
		} else {
			// A `{}` wrapper is only allowed as the entire argument.
			if (meaningful.some((componentValue) => isSimpleBlockNode(componentValue) && isTokenOpenCurly(componentValue.startToken))) {
				return false;
			}

			argument = stringify([trim(rawArgument)]).trim();
		}

		if (IS_IMPORTANT_REGEX.test(argument)) {
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

const IS_SCOPE_REGEX = /^scope$/i;

function isInStyleRule(atRule: AtRule): boolean {
	const parent = atRule.parent;
	if (!parent || parent.type === 'root') {
		return false;
	}

	if (parent.type === 'rule') {
		return true;
	}

	if (parent.type === 'atrule' && IS_SCOPE_REGEX.test(parent.name)) {
		return true;
	}

	return isInStyleRule(parent);
}
