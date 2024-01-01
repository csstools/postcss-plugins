import { CSSToken } from '../interfaces/token';

/**
 * Deep clone a list of tokens.
 * Useful for mutations without altering the original list.
 */
export function cloneTokens(tokens: Array<CSSToken>): Array<CSSToken> {
	if ((typeof globalThis !== 'undefined') && 'structuredClone' in globalThis) {
		return structuredClone(tokens);
	}

	return JSON.parse(JSON.stringify(tokens));
}
