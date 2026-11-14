import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isTokenNode, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import { isTokenComma } from '@csstools/css-tokenizer';
import { containsCurlyBlock, hasInvalidDeclarationValue, singleCurlyBlock } from '../util/declaration-value';

/**
 * Parse the arguments of a `<dashed-function>`.
 *
 * Returns `false` when the arguments are invalid.
 *
 * https://drafts.csswg.org/css-mixins-1/#typedef-dashed-function
 */
export function parseDashedFunctionArguments(componentValues: Array<ComponentValue>): Array<Array<ComponentValue>> | false {
	const args: Array<Array<ComponentValue>> = [];

	let start = 0;
	let sawComma = false;

	for (let i = 0; i <= componentValues.length; i++) {
		if (i < componentValues.length) {
			const componentValue = componentValues[i];
			if (!isTokenNode(componentValue) || !isTokenComma(componentValue.value)) {
				continue;
			}

			sawComma = true;
		}

		const list = componentValues.slice(start, i);
		start = i + 1;

		// A trailing empty argument is dropped. Without a comma it means no arguments.
		if (i === componentValues.length && list.every(isWhiteSpaceOrCommentNode)) {
			return sawComma ? args : [];
		}

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
