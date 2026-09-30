import type { CSSToken } from './interfaces/token';

/**
 * Concatenate the string representation of a list of tokens.
 * This is not a proper serializer that will handle escaping and whitespace.
 * It only produces valid CSS for a token list that is also valid.
 */
export function stringify(...tokens: Array<CSSToken> | Array<Array<CSSToken>>): string {
	if (!tokens || !tokens.length) {
		return '';
	}

	let t;
	if (Array.isArray(tokens) && Array.isArray(tokens[0]) && Array.isArray(tokens[0][0])) {
		t = tokens[0] as Array<CSSToken>;
	} else {
		t = tokens as Array<CSSToken>;
	}

	let buffer = '';
	for (let i = 0; i < t.length; i++) {
		buffer = buffer + t[i][1];
	}

	return buffer;
}
