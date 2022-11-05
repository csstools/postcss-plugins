import { CSSToken } from '../interfaces/token';

export function cloneTokens(tokens: Array<CSSToken>): Array<CSSToken> {
	if ((typeof globalThis !== 'undefined') && 'structuredClone' in globalThis) {
		return structuredClone(tokens);
	}

	return JSON.parse(JSON.stringify(tokens));
}
