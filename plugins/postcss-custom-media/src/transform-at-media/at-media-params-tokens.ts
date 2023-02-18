import { tokenizer } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer';

export function atMediaParamsTokens(params: string): Array<CSSToken> {
	const t = tokenizer({
		css: params,
	}, {
		onParseError: () => {
			throw new Error(`Unable to parse media query "${params}"`);
		},
	});

	const tokens: Array<CSSToken> = [];
	while (!t.endOfFile()) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tokens.push(t.nextToken()!);
	}

	return tokens;
}
