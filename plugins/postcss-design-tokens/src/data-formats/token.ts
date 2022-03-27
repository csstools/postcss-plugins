import { Token } from './base/token';

export function mergeTokens(a: Map<string, Token>, b: Map<string, Token>): Map<string, Token> {
	const result = new Map(a);
	for (const [key, value] of b) {
		result.set(key, value);
	}
	return result;
}
