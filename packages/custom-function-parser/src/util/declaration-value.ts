import type { ComponentValue, SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { isSimpleBlockNode, isTokenNode, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import { isTokenBadString, isTokenBadURL, isTokenCloseCurly, isTokenCloseParen, isTokenCloseSquare, isTokenDelim, isTokenOpenCurly, isTokenSemicolon } from '@csstools/css-tokenizer';

/**
 * Whether a component value list violates `<declaration-value>`.
 *
 * https://drafts.csswg.org/css-syntax-3/#typedef-declaration-value
 */
export function hasInvalidDeclarationValue(componentValues: Array<ComponentValue>): boolean {
	for (const componentValue of componentValues) {
		if (!isTokenNode(componentValue)) {
			continue;
		}

		const token = componentValue.value;

		if (
			isTokenBadString(token) ||
			isTokenBadURL(token) ||
			isTokenCloseParen(token) ||
			isTokenCloseSquare(token) ||
			isTokenCloseCurly(token) ||
			isTokenSemicolon(token) ||
			(isTokenDelim(token) && token[4].value === '!')
		) {
			return true;
		}
	}

	return false;
}

/**
 * The only meaningful `{}` block in a component value list, or `null`.
 */
export function singleCurlyBlock(componentValues: Array<ComponentValue>): SimpleBlockNode | null {
	let block: SimpleBlockNode | null = null;

	for (const componentValue of componentValues) {
		if (isWhiteSpaceOrCommentNode(componentValue)) {
			continue;
		}

		if (!block && isSimpleBlockNode(componentValue) && isTokenOpenCurly(componentValue.startToken)) {
			block = componentValue;
			continue;
		}

		return null;
	}

	return block;
}

/**
 * Whether a component value list contains a top-level `{}` block.
 */
export function containsCurlyBlock(componentValues: Array<ComponentValue>): boolean {
	return componentValues.some((componentValue) => {
		return isSimpleBlockNode(componentValue) && isTokenOpenCurly(componentValue.startToken);
	});
}
