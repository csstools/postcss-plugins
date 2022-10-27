import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, tokenizer } from '@csstools/css-tokenizer';
import { MediaQueryWithoutType, MediaQueryWithType } from '../nodes/media-query';
import { parseMediaQuery } from './parse-media-query';

export type Options = {
	preserveInvalidMediaQueries?: boolean
}

export function parseFromTokens(tokens: Array<CSSToken>, options?: Options) {
	const onParseError = (err) => {
		console.warn(err);
		throw new Error(`Unable to parse "${stringify(...tokens)}"`);
	};

	const componentValuesLists = parseCommaSeparatedListOfComponentValues(tokens, {
		onParseError: onParseError,
	});

	return componentValuesLists.map((componentValuesList, index) => {
		const mediaQuery = parseMediaQuery(componentValuesList);
		if (mediaQuery == false && options?.preserveInvalidMediaQueries === true) {
			return componentValuesLists[index].map((x) => x.toString()).join('');
		}

		return mediaQuery;
	}).filter((x) => !!x) as Array<MediaQueryWithType | MediaQueryWithoutType>;
}

export function parse(source: string, options?: Options) {
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

	return parseFromTokens(tokens, options);
}
