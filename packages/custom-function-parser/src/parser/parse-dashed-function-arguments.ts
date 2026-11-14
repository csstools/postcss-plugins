import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isTokenNode, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import { isTokenComma } from '@csstools/css-tokenizer';
import { containsCurlyBlock, hasInvalidDeclarationValue, singleCurlyBlock } from '../util/declaration-value';

/**
 * Parse the arguments of a `<dashed-function>`.
 *
 * https://drafts.csswg.org/css-mixins-1/#typedef-dashed-function
 */
export function parseDashedFunctionArguments(fn: FunctionNode): Array<Array<ComponentValue>> | false {
	const lists: Array<Array<ComponentValue>> = [[]];

	for (const componentValue of fn.value) {
		if (isTokenNode(componentValue) && isTokenComma(componentValue.value)) {
			lists.push([]);
			continue;
		}

		lists[lists.length - 1].push(componentValue);
	}

	if (lists.length === 1 && lists[0].every(isWhiteSpaceOrCommentNode)) {
		return [];
	}

	if (lists[lists.length - 1].every(isWhiteSpaceOrCommentNode)) {
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
	const block = singleCurlyBlock(list);
	if (block) {
		return trim(block.value);
	}

	if (containsCurlyBlock(list)) {
		return false;
	}

	return trim(list);
}

function trim(componentValues: Array<ComponentValue>): Array<ComponentValue> {
	let start = 0;
	let end = 0;
	let sawMeaningful = false;

	for (let i = 0; i < componentValues.length; i++) {
		if (isWhiteSpaceOrCommentNode(componentValues[i])) {
			continue;
		}

		if (!sawMeaningful) {
			start = i;
			sawMeaningful = true;
		}

		end = i + 1;
	}

	return sawMeaningful ? componentValues.slice(start, end) : [];
}
