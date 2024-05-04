import { CSSToken, ParseError, TokenType, isTokenEOF } from '@csstools/css-tokenizer';
import { ComponentValue, consumeComponentValue } from '../consume/component-block-function';

/**
 * Parse a list of component values.
 *
 * @example
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
 *
 * parseListOfComponentValues(tokenize({ css: `20deg 30%` }));
 * ```
 */
export function parseListOfComponentValues(tokens: Array<CSSToken>, options?: { onParseError?: (error: ParseError) => void }): Array<ComponentValue> {
	const ctx = {
		onParseError: options?.onParseError ?? ((): void => { /* noop */ }),
	};

	const tokensCopy = [
		...tokens,
	];

	// We expect the last token to be an EOF token.
	// Passing slices of tokens to this function can easily cause the EOF token to be missing.
	if (isTokenEOF(tokensCopy[tokensCopy.length - 1])) {
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
		if (!tokensCopy[i] || isTokenEOF(tokensCopy[i])) {
			return list;
		}

		const result = consumeComponentValue(ctx, tokensCopy.slice(i));
		list.push(result.node);
		i += result.advance;
	}
}
