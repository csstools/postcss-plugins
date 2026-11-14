import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { isTokenNode, isWhiteSpaceOrCommentNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import type { CSSToken, TokenColon, TokenIdent } from '@csstools/css-tokenizer';
import { isTokenColon, isTokenComma, isTokenIdent } from '@csstools/css-tokenizer';
import { FunctionParameter } from '../nodes/function-parameter';
import { tokensOf } from '../util/component-values';
import { containsCurlyBlock, hasInvalidDeclarationValue, singleCurlyBlock } from '../util/declaration-value';

/**
 * Parse a `<function-parameter>#? ,?` list.
 *
 * Returns `false` when the list is invalid.
 *
 * https://drafts.csswg.org/css-mixins-1/#function-rule
 */
export function parseFunctionParameters(componentValues: Array<ComponentValue>): Array<FunctionParameter> | false {
	const parameters: Array<FunctionParameter> = [];
	const seenNames = new Set<string>();

	let i = 0;

	while (i < componentValues.length) {
		const beforeStart = i;

		while (i < componentValues.length && isWhiteSpaceOrCommentNode(componentValues[i])) {
			i++;
		}

		if (i >= componentValues.length) {
			return parameters;
		}

		const nameComponentValue = componentValues[i];
		if (!isTokenNode(nameComponentValue) || !isTokenIdent(nameComponentValue.value)) {
			return false;
		}

		const nameToken: TokenIdent = nameComponentValue.value;
		if (!nameToken[4].value.startsWith('--') || nameToken[4].value === '--') {
			return false;
		}

		const nameIndex = i;
		let lastNonWhitespaceIndex = i;
		i++;

		// <css-type>? stops at the first top-level colon, comma or the end.
		const parameterTypeStart = i;
		let colonToken: TokenColon | null = null;

		while (i < componentValues.length) {
			const componentValue = componentValues[i];
			if (isTokenNode(componentValue)) {
				if (isTokenColon(componentValue.value)) {
					colonToken = componentValue.value;
					lastNonWhitespaceIndex = i;
					break;
				}

				if (isTokenComma(componentValue.value)) {
					break;
				}
			}

			if (!isWhitespaceNode(componentValue)) {
				lastNonWhitespaceIndex = i;
			}

			i++;
		}

		let parameterTypeEnd = i;

		let defaultValueStart = -1;
		let defaultValueEnd = -1;

		if (colonToken) {
			i++;
			defaultValueStart = i;

			while (i < componentValues.length) {
				const componentValue = componentValues[i];
				if (isTokenNode(componentValue) && isTokenComma(componentValue.value)) {
					break;
				}

				if (!isWhitespaceNode(componentValue)) {
					lastNonWhitespaceIndex = i;
				}

				i++;
			}

			defaultValueEnd = i;

			const defaultValueComponentValues = componentValues.slice(defaultValueStart, defaultValueEnd);
			if (hasInvalidDeclarationValue(defaultValueComponentValues)) {
				return false;
			}

			const block = singleCurlyBlock(defaultValueComponentValues);
			if (block) {
				if (hasInvalidDeclarationValue(block.value)) {
					return false;
				}
			} else if (containsCurlyBlock(defaultValueComponentValues)) {
				return false;
			}
		}

		let after: Array<CSSToken>;
		if (i < componentValues.length) {
			const comma = componentValues[i];
			if (!isTokenNode(comma) || !isTokenComma(comma.value)) {
				return false;
			}

			after = [comma.value];
			i++;
		} else {
			const afterStart = lastNonWhitespaceIndex + 1;
			after = tokensOf(componentValues, afterStart);
			parameterTypeEnd = Math.min(parameterTypeEnd, afterStart);
			if (defaultValueEnd !== -1) {
				defaultValueEnd = Math.min(defaultValueEnd, afterStart);
			}
		}

		const name = nameToken[4].value;
		if (seenNames.has(name)) {
			// The same custom property name may not appear more than once.
			return false;
		}

		seenNames.add(name);

		parameters.push(new FunctionParameter(
			nameToken,
			tokensOf(componentValues, parameterTypeStart, parameterTypeEnd),
			colonToken,
			defaultValueEnd === -1 ? [] : tokensOf(componentValues, defaultValueStart, defaultValueEnd),
			tokensOf(componentValues, beforeStart, nameIndex),
			after,
		));
	}

	return parameters;
}
