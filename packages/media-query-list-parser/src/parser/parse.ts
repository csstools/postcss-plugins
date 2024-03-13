import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { CSSToken, tokenizer, ParseError } from '@csstools/css-tokenizer';
import { MediaQuery, MediaQueryInvalid } from '../nodes/media-query';
import { parseMediaQuery } from './parse-media-query';

export function parseFromTokens(
	tokens: Array<CSSToken>,
	options?: {
		preserveInvalidMediaQueries?: boolean,
		onParseError?: (error: ParseError) => void
	},
): Array<MediaQuery> {
	const componentValuesLists = parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: options?.onParseError,
	});

	return componentValuesLists.map((componentValuesList, index) => {
		const mediaQuery = parseMediaQuery(componentValuesList);
		if (mediaQuery === false && options?.preserveInvalidMediaQueries === true) {
			return new MediaQueryInvalid(componentValuesLists[index]);
		}

		return mediaQuery;
	}).filter((x): x is MediaQuery => !!x);
}

export function parse(
	source: string,
	options?: {
		preserveInvalidMediaQueries?: boolean,
		onParseError?: (error: ParseError) => void
	},
): Array<MediaQuery> {
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
