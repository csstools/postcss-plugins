import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import type { CSSToken} from '@csstools/css-tokenizer';
import { tokenizer } from '@csstools/css-tokenizer';

function parseComponentValuesFromTokens(tokens: Array<CSSToken>): Array<ComponentValue> {
	return parseListOfComponentValues(tokens, {
		onParseError: (err) => {
			throw err;
		},
	});
}

export function parseComponentValues(source: string): Array<ComponentValue> {
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
