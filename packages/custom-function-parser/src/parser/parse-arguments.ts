import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { containsBracedBlock, hasInvalidDeclarationValue, singleBracedBlock } from './declaration-value';

/** Parse the arguments of a `<dashed-function>`. */
export function parseDashedFunctionArguments(fn: FunctionNode): Array<Array<ComponentValue>> | false {
	const lists = parseCommaSeparatedListOfComponentValues(fn.value.flatMap((componentValue) => componentValue.tokens()));

	if (lists.length === 0) {
		return [];
	}

	if (lists.length === 1 && isBlank(lists[0])) {
		return [];
	}

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

function unwrapArgument(list: Array<ComponentValue>): Array<ComponentValue> | false {
	const block = singleBracedBlock(list);
	if (block) {
		return trim(block.value);
	}

	if (containsBracedBlock(list)) {
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
