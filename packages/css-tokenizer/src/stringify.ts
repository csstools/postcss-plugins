import type { CSSToken } from './interfaces/token';

/**
 * Concatenate the string representation of a list of tokens.
 * This is not a proper serializer that will handle escaping and whitespace.
 * It only produces valid CSS for a token list that is also valid.
 */
export function stringify(...tokens: Array<CSSToken>): string {
	let buffer = '';
	for (let i = 0; i < tokens.length; i++) {
		buffer = buffer + tokens[i][1];
	}

	return buffer;
}
