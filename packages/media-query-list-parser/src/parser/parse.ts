import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { tokenizer } from '@csstools/css-tokenizer';
import { parseMediaQuery } from './parse-media-query';

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

	return parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: onParseError,
	}).map((componentValuesList) => {
		return parseMediaQuery(componentValuesList);
	}).filter((x) => !!x);
}
