import { CSSToken, ParseError, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, consumeComponentValue } from '../consume/component-block-function';

/**
 * Parse a list of component values.
 *
 * @example
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseListOfComponentValues } from '@csstools/css-parser';
 *
 * parseListOfComponentValues(tokenize({ css: `20deg 30%` }));
 * ```
 */
export function parseListOfComponentValues(tokens: Array<CSSToken>, options?: { onParseError?: (error: ParseError) => void }) {
	const ctx = {
		onParseError: options?.onParseError ?? (() => { /* noop */ }),
	};

	const tokensCopy = [
		...tokens,
	];

	// We expect the last token to be an EOF token.
	// Passing slices of tokens to this function can easily cause the EOF token to be missing.
	if (tokensCopy[tokensCopy.length - 1][0] !== TokenType.EOF) {
		tokensCopy.push([
			TokenType.EOF,
			'',
			tokensCopy[tokensCopy.length - 1][2],
			tokensCopy[tokensCopy.length - 1][3],
			undefined,
		]);
	}

	const list: Array<ComponentValue> = [];

	let i = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (!tokensCopy[i] || tokensCopy[i][0] === TokenType.EOF) {
			return list;
		}

		const result = consumeComponentValue(ctx, tokensCopy.slice(i));
		list.push(result.node);
		i += result.advance;
	}
}
