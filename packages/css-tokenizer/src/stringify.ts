import type { CSSToken } from './interfaces/token';

export function stringify(...tokens: Array<CSSToken>): string {
	let buffer = '';
	for (let i = 0; i < tokens.length; i++) {
		buffer = buffer + tokens[i][1];
	}

	return buffer;
}
