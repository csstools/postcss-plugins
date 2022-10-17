import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { tokenizer } from '@csstools/css-tokenizer';

export function parse(source: string) {
	const onParseError = (err) => {
		console.warn(err);
		throw new Error(`Unable to parse "${source}"`);
	};
	const t = tokenizer({ css: source }, {
		commentsAreTokens: true,
		onParseError: onParseError,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	const result = parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: onParseError,
	});

	return result;
}
