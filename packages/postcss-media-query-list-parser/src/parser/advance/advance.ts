import { CSSToken, mirrorVariant, TokenType } from '@csstools/css-tokenizer';

// https://www.w3.org/TR/css-syntax-3/#consume-a-component-value
export function advanceComponentValue(tokens: Array<CSSToken>): number {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (
			token[0] === TokenType.OpenParen ||
			token[0] === TokenType.OpenCurly ||
			token[0] === TokenType.OpenSquare
		) {
			i += advanceSimpleBlock(tokens.slice(i));
			return i;
		}

		if (token[0] === TokenType.Function) {
			i += advanceFunction(tokens.slice(i));
			return i;
		}

		return i;
	}
}

// https://www.w3.org/TR/css-syntax-3/#consume-function
export function advanceFunction(tokens: Array<CSSToken>): number | null {
	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];

		if (token[0] === TokenType.CloseParen) {
			return i;
		}

		i += advanceComponentValue(tokens.slice(i));
	}

	throw new Error('Failed to parse');
}

/** https://www.w3.org/TR/css-syntax-3/#consume-simple-block */
export function advanceSimpleBlock(tokens: Array<CSSToken>): number | null {
	const endingToken = mirrorVariant(tokens[0][0]);
	if (!endingToken) {
		throw new Error('Failed to parse');
	}

	for (let i = 1; i < tokens.length; i++) {
		const token = tokens[i];

		if (token[0] === endingToken) {
			return i;
		}

		i += advanceComponentValue(tokens.slice(i));
	}

	throw new Error('Failed to parse');
}
