import { CSSToken, ParseError, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue, consumeComponentValue } from '../consume/consume-component-block-function';

export function parseCommaSeparatedListOfComponentValues(tokens: Array<CSSToken>, options?: { onParseError?: (error: ParseError) => void }) {
	const ctx = {
		onParseError: options?.onParseError ?? (() => { /* noop */ }),
	};

	const tokensCopy = [
		...tokens,
	];

	if (tokens.length === 0) {
		return [];
	}

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

	const listOfCvls: Array<Array<ComponentValue>> = [];
	let list: Array<ComponentValue> = [];

	let i = 0;

	// eslint-disable-next-line no-constant-condition
	while (true) {
		if (!tokensCopy[i] || tokensCopy[i][0] === TokenType.EOF) {
			if (list.length) {
				listOfCvls.push(list);
			}

			return listOfCvls;
		}

		if (tokensCopy[i][0] === TokenType.Comma) {
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
