import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode, isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { isTokenDelim, isTokenIdent, isTokenOpenCurly } from '@csstools/css-tokenizer';

export function parseArguments(fn: FunctionNode): Array<Array<ComponentValue>> | false {
	const meaningful = fn.value.filter((componentValue) => !isWhiteSpaceOrCommentNode(componentValue));
	if (meaningful.length === 0) {
		return [];
	}

	const lists = parseCommaSeparatedListOfComponentValues(fn.value.flatMap((componentValue) => componentValue.tokens()));

	const args: Array<Array<ComponentValue>> = [];
	for (const list of lists) {
		const arg = unwrapArgument(list);
		if (!arg) {
			return false;
		}

		args.push(arg);
	}

	return args;
}

export function hasImportant(componentValues: Array<ComponentValue>): boolean {
	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];

		if (isFunctionNode(componentValue) || isSimpleBlockNode(componentValue)) {
			if (hasImportant(componentValue.value)) {
				return true;
			}

			continue;
		}

		if (!isTokenNode(componentValue) || !isTokenDelim(componentValue.value) || componentValue.value[4].value !== '!') {
			continue;
		}

		for (let j = i + 1; j < componentValues.length; j++) {
			const next = componentValues[j];
			if (isWhiteSpaceOrCommentNode(next)) {
				continue;
			}

			if (isTokenNode(next) && isTokenIdent(next.value) && next.value[4].value.toLowerCase() === 'important') {
				return true;
			}

			break;
		}
	}

	return false;
}

/**
 * Strip a `{}` wrapper from a single argument.
 *
 * https://drafts.csswg.org/css-values-5/#component-function-commas
 */
function unwrapArgument(list: Array<ComponentValue>): Array<ComponentValue> | false {
	const meaningful = list.filter((componentValue) => !isWhiteSpaceOrCommentNode(componentValue));
	if (meaningful.length === 0) {
		return false;
	}

	if (
		meaningful.length === 1 &&
		isSimpleBlockNode(meaningful[0]) &&
		isTokenOpenCurly(meaningful[0].startToken)
	) {
		return meaningful[0].value;
	}

	return list;
}
