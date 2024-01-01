import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import { CSSToken, tokenizer } from '@csstools/css-tokenizer';

function parseComponentValuesFromTokens(tokens: Array<CSSToken>) {
	return parseListOfComponentValues(tokens, {
		onParseError: (err) => {
			throw err;
		},
	});
}

export function parseComponentValues(source: string) {
	const t = tokenizer({ css: source }, {
		onParseError: (err) => {
			throw err;
		},
	});

	const tokens: Array<CSSToken> = [];

	{
		while (!t.endOfFile()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			tokens.push(t.nextToken()!);
		}

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		tokens.push(t.nextToken()!); // EOF-token
	}

	return parseComponentValuesFromTokens(tokens);
}
