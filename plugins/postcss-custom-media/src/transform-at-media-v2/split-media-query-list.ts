import type { CSSToken } from '@csstools/css-tokenizer';
import { parseFromTokens } from '@csstools/media-query-list-parser';

export function splitMediaQueryList(tokens: Array<CSSToken>): Array<Array<CSSToken>> {
	return parseFromTokens(tokens, { preserveInvalidMediaQueries : true }).map((x) => {
		return x.tokens();
	});
}
