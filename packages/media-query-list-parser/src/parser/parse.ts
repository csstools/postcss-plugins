import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';
import type { CSSToken, ParseError } from '@csstools/css-tokenizer';
import { tokenize } from '@csstools/css-tokenizer';
import type { MediaQuery} from '../nodes/media-query';
import { MediaQueryInvalid } from '../nodes/media-query';
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
	return parseFromTokens(tokenize({ css: source }, {
		onParseError: options?.onParseError,
	}), options);
}
