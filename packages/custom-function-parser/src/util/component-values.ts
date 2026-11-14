import type { ComponentValue } from '@csstools/css-parser-algorithms';
import type { CSSToken } from '@csstools/css-tokenizer';

/**
 * Flatten a range of component values into tokens.
 */
export function tokensOf(componentValues: Array<ComponentValue>, start = 0, end = componentValues.length): Array<CSSToken> {
	const tokens: Array<CSSToken> = [];

	for (let i = start; i < end; i++) {
		for (const token of componentValues[i].tokens()) {
			tokens.push(token);
		}
	}

	return tokens;
}
