import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { isTokenDelim, isTokenOpenCurly, isTokenSemicolon } from '@csstools/css-tokenizer';

/**
 * Parse the arguments of a `<dashed-function>`.
 *
 * https://drafts.csswg.org/css-mixins-1/#typedef-dashed-function
 */
export function parseArguments(fn: FunctionNode): Array<Array<ComponentValue>> | false {
	const lists = parseCommaSeparatedListOfComponentValues(fn.value.flatMap((componentValue) => componentValue.tokens()));

	// `--foo()` passes no arguments.
	if (lists.length === 0) {
		return [];
	}

	// `--foo( )` passes no arguments.
	if (lists.length === 1 && isBlank(lists[0])) {
		return [];
	}

	// A final trailing comma does not pass an argument.
	if (isBlank(lists[lists.length - 1])) {
		lists.pop();
	}

	const args: Array<Array<ComponentValue>> = [];
	for (const list of lists) {
		const arg = unwrapArgument(list);
		if (!arg || hasInvalidDeclarationValue(arg)) {
			return false;
		}

		args.push(arg);
	}

	return args;
}

/**
 * Strip a `{}` wrapper from a single argument.
 *
 * https://drafts.csswg.org/css-values-5/#component-function-commas
 */
function unwrapArgument(list: Array<ComponentValue>): Array<ComponentValue> | false {
	const meaningful = list.filter((componentValue) => !isWhiteSpaceOrCommentNode(componentValue));

	if (meaningful.length === 0) {
		return [];
	}

	if (
		meaningful.length === 1 &&
		isSimpleBlockNode(meaningful[0]) &&
		isTokenOpenCurly(meaningful[0].startToken)
	) {
		return trim(meaningful[0].value);
	}

	// A `{}` wrapper is only allowed as the entire argument.
	if (meaningful.some((componentValue) => isSimpleBlockNode(componentValue) && isTokenOpenCurly(componentValue.startToken))) {
		return false;
	}

	return trim(list);
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
