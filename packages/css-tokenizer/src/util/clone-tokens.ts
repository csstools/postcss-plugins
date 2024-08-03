import type { CSSToken } from '../interfaces/token';

const supportsStructuredClone = (typeof globalThis !== 'undefined') && 'structuredClone' in globalThis;

/**
 * Deep clone a list of tokens.
 * Useful for mutations without altering the original list.
 */
export function cloneTokens(tokens: Array<CSSToken>): Array<CSSToken> {
	if (supportsStructuredClone) {
		return structuredClone(tokens);
	}

	return JSON.parse(JSON.stringify(tokens)) as Array<CSSToken>;
}
