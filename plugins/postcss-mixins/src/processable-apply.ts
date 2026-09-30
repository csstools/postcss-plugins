import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isSimpleBlockNode, isTokenNode, parseCommaSeparatedListOfComponentValues, parseComponentValue, stringify } from '@csstools/css-parser-algorithms';
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

	// `--foo()` has no arguments.
	if (rawArguments.length === 1 && stringify([rawArguments[0]]).trim() === '') {
		return [];
	}

	const args: Array<string> = [];

	for (const rawArgument of rawArguments) {
		// A comma-containing value can be passed as a single argument by wrapping it in `{}`.
		const argument = (rawArgument.length === 1 && isSimpleBlockNode(rawArgument[0]) && isTokenOpenCurly(rawArgument[0].startToken)
			? stringify([rawArgument[0].value])
			: stringify([rawArgument])
		).trim();

		if (argument === '') {
			return false;
		}

		if (IS_IMPORTANT_REGEX.test(argument)) {
			return false;
		}

		args.push(argument);
	}

	return args;
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
