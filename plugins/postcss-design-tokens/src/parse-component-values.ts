import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import type { CSSToken} from '@csstools/css-tokenizer';
import { tokenize } from '@csstools/css-tokenizer';

function parseComponentValuesFromTokens(tokens: Array<CSSToken>): Array<ComponentValue> {
	return parseListOfComponentValues(tokens, {
		onParseError: (err) => {
			throw err;
		},
	});
}

export function parseComponentValues(source: string): Array<ComponentValue> {
	return parseComponentValuesFromTokens(tokenize({ css: source }, {
		onParseError: (err) => {
			throw err;
		},
	}));
}
