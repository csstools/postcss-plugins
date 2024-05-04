import { CSSToken, ParseError, TokenType, isTokenEOF } from '@csstools/css-tokenizer';
import { ComponentValue, consumeComponentValue } from '../consume/component-block-function';

/**
 * Parse a single component value.
 *
 * @example
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
 *
 * parseCommaSeparatedListOfComponentValues(tokenize({ css: `10px` }));
 * parseCommaSeparatedListOfComponentValues(tokenize({ css: `calc((10px + 1x) * 4)` }));
 * ```
 */
export function parseComponentValue(tokens: Array<CSSToken>, options?: { onParseError?: (error: ParseError) => void }): ComponentValue|undefined {
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

	const result = consumeComponentValue(ctx, tokensCopy);
	if (isTokenEOF(tokensCopy[Math.min(result.advance, tokensCopy.length - 1)])) {
		return result.node;
	}

	ctx.onParseError(new ParseError(
		'Expected EOF after parsing a component value.',
		tokens[0][2],
		tokens[tokens.length - 1][3],
		[
			'5.3.9. Parse a component value',
			'Expected EOF',
		],
	));
}
