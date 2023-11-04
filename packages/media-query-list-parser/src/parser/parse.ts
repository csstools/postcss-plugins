import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { CSSToken, tokenizer, ParseError } from '@csstools/css-tokenizer';
import { MediaQuery, MediaQueryInvalid } from '../nodes/media-query';
import { parseMediaQuery } from './parse-media-query';

type Options = {
	preserveInvalidMediaQueries?: boolean,
	onParseError?: (error: ParseError) => void
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
		onParseError: options?.onParseError,
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

	return parseFromTokens(tokens, options);
}
