import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { ParserError } from '@csstools/css-parser-algorithms/dist/interfaces/error';
import { CSSToken, tokenizer } from '@csstools/css-tokenizer';
import { MediaQuery, MediaQueryInvalid } from '../nodes/media-query';
import { parseMediaQuery } from './parse-media-query';

export type Options = {
	preserveInvalidMediaQueries?: boolean,
	onParseError?: (error: ParserError) => void
}

export function parseFromTokens(tokens: Array<CSSToken>, options?: Options) {
	const componentValuesLists = parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: options?.onParseError,
	});

	return componentValuesLists.map((componentValuesList, index) => {
		const mediaQuery = parseMediaQuery(componentValuesList);
		if (mediaQuery == false && options?.preserveInvalidMediaQueries === true) {
			return new MediaQueryInvalid(componentValuesLists[index]);
		}

		return mediaQuery;
	}).filter((x) => !!x) as Array<MediaQuery>;
}

export function parse(source: string, options?: Options) {
	const t = tokenizer({ css: source }, {
		commentsAreTokens: true,
		onParseError: options?.onParseError,
	});

	const tokens = [];

	{
		while (!t.endOfFile()) {
			tokens.push(t.nextToken());
		}

		tokens.push(t.nextToken()); // EOF-token
	}

	return parseFromTokens(tokens, options);
}
