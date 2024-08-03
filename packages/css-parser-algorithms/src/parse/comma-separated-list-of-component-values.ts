import type { CSSToken, ParseError} from '@csstools/css-tokenizer';
import { TokenType, isTokenComma, isTokenEOF } from '@csstools/css-tokenizer';
import type { ComponentValue} from '../consume/component-block-function';
import { consumeComponentValue } from '../consume/component-block-function';

/**
 * Parse a comma-separated list of component values.
 *
 * @example
 * ```js
 * import { tokenize } from '@csstools/css-tokenizer';
 * import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
 *
 * parseCommaSeparatedListOfComponentValues(tokenize({ css: `20deg, 50%, 30%` }));
 * ```
 */
export function parseCommaSeparatedListOfComponentValues(tokens: Array<CSSToken>, options?: { onParseError?: (error: ParseError) => void }): Array<Array<ComponentValue>> {
	const ctx = {
		onParseError: options?.onParseError ?? ((): void => { /* noop */ }),
	};

	const tokensCopy = [
		...tokens,
	];

	if (tokens.length === 0) {
		return [];
	}

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

	const listOfCvls: Array<Array<ComponentValue>> = [];
	let list: Array<ComponentValue> = [];

	let i = 0;

	while (true) {
		if (!tokensCopy[i] || isTokenEOF(tokensCopy[i])) {
			if (list.length) {
				listOfCvls.push(list);
			}

			return listOfCvls;
		}

		if (isTokenComma(tokensCopy[i])) {
			listOfCvls.push(list);
			list = [];
			i++;
			continue;
		}

		const result = consumeComponentValue(ctx, tokens.slice(i));
		list.push(result.node);
		i += result.advance;
	}
}
