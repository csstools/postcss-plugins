import type { TokenDimension, TokenNumber, TokenPercentage } from '@csstools/css-tokenizer';
import { isTokenNumeric, isToken, tokenizer } from '@csstools/css-tokenizer';

export type Globals = Map<string, TokenDimension | TokenNumber | TokenPercentage>;
export type GlobalsWithStrings = Map<string, TokenDimension | TokenNumber | TokenPercentage | string>;

export function tokenizeGlobals(x: GlobalsWithStrings | undefined): Globals {
	const copy: Globals = new Map();
	if (!x) {
		return copy;
	}

	for (const [key, value] of x) {
		if (isToken(value)) {
			copy.set(key, value);
			continue;
		}

		if (typeof value === 'string') {
			const t = tokenizer({
				css: value,
			});

			const token = t.nextToken();

			// Values must be single tokens
			// If it isn't EOF after a single token, we skip this pair
			t.nextToken();
			if (!t.endOfFile()) {
				continue;
			}

			if (!isTokenNumeric(token)) {
				continue;
			}

			copy.set(key, token);
			continue;
		}
	}

	return copy;
}
