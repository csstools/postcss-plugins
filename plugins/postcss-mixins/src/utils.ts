import type { AtRule } from 'postcss';
import type { CSSToken } from '@csstools/css-tokenizer';
import { isTokenEOF, isTokenWhiteSpaceOrComment, tokenize } from '@csstools/css-tokenizer';

/** The prelude of an at-rule as written, with comments. */
export function rawParams(atRule: AtRule): string {
	const raw = atRule.raws.params;

	return raw && raw.value === atRule.params ? raw.raw : atRule.params;
}

/** The tokens of a prelude, without leading and trailing whitespace and comments. */
export function preludeTokens(params: string): Array<CSSToken> {
	const tokens = tokenize({ css: params }).filter((token) => !isTokenEOF(token));

	let start = 0;
	let end = tokens.length;

	while (start < end && isTokenWhiteSpaceOrComment(tokens[start])) {
		start++;
	}

	while (end > start && isTokenWhiteSpaceOrComment(tokens[end - 1])) {
		end--;
	}

	return tokens.slice(start, end);
}
