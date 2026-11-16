import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { isTokenIdent } from '@csstools/css-tokenizer';
import { CustomFunction } from '../nodes/custom-function';
import { tokensOf } from '../util/component-values';
import { parseFunctionParameters } from './parse-function-parameters';

/**
 * Parse a `@function` prelude.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-prelude
 */
export function parseCustomFunction(componentValues: Array<ComponentValue>): CustomFunction | false {
	let fnNode: FunctionNode | null = null;
	let fnIndex = -1;
	let returnsKeywordIndex = -1;
	let returnTypeIndex = -1;
	let lastMeaningfulIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		lastMeaningfulIndex = i;

		if (fnIndex === -1) {
			if (!isFunctionNode(componentValue) || !componentValue.getName().startsWith('--')) {
				return false;
			}

			fnIndex = i;
			fnNode = componentValue;
			continue;
		}

		if (returnTypeIndex !== -1) {
			continue;
		}

		if (returnsKeywordIndex === -1) {
			if (
				!isTokenNode(componentValue) ||
				!isTokenIdent(componentValue.value) ||
				componentValue.value[4].value.toLowerCase() !== 'returns'
			) {
				return false;
			}

			returnsKeywordIndex = i;
			continue;
		}

		returnTypeIndex = i;
	}

	if (returnsKeywordIndex !== -1 && returnTypeIndex === -1) {
		return false;
	}

	if (!fnNode) {
		return false;
	}

	const parameters = parseFunctionParameters(fnNode.value);
	if (!parameters) {
		return false;
	}

	return new CustomFunction(
		fnNode,
		parameters,
		returnsKeywordIndex === -1 ? [] : tokensOf(componentValues, fnIndex + 1, returnTypeIndex),
		returnTypeIndex === -1 ? [] : tokensOf(componentValues, returnTypeIndex, lastMeaningfulIndex + 1),
		tokensOf(componentValues, 0, fnIndex),
		tokensOf(componentValues, lastMeaningfulIndex + 1),
	);
}
