import type { TokenIdent } from '@csstools/css-tokenizer';
import { cloneTokens, isTokenWhiteSpaceOrComment, stringify } from '@csstools/css-tokenizer';
import type { MediaQuery } from '@csstools/media-query-list-parser';
import { parseFromTokens } from '@csstools/media-query-list-parser';
import { atMediaParamsTokens } from '../transform-at-media/at-media-params-tokens';
import { replaceTrueAndFalseTokens } from './true-and-false';
import { isTokenIdent } from '@csstools/css-tokenizer';

export function parseCustomMedia(params: string): { name: string, truthy: Array<MediaQuery>, falsy: Array<MediaQuery>, dependencies: Array<[string, string]> } | false {
	const tokens = atMediaParamsTokens(params);

	const customMediaReferences: Set<string> = new Set();

	let name = '';
	let remainder = tokens;
	for (let i = 0; i < tokens.length; i++) {
		if (isTokenWhiteSpaceOrComment(tokens[i])) {
			continue;
		}

		if (isTokenIdent(tokens[i])) {
			const identToken = tokens[i] as TokenIdent;
			if (identToken[4].value.startsWith('--')) {
				name = identToken[4].value;
				remainder = tokens.slice(i + 1);
				break;
			}
		}

		return false;
	}

	for (let i = 0; i < remainder.length; i++) {
		if (isTokenIdent(remainder[i])) {
			const identToken = remainder[i] as TokenIdent;
			if (identToken[4].value.startsWith('--')) {
				customMediaReferences.add(identToken[4].value);
			}
		}
	}

	remainder = replaceTrueAndFalseTokens(remainder);

	const mediaQueryListTruthy = parseFromTokens(cloneTokens(remainder), {
		preserveInvalidMediaQueries: true,
		onParseError: () => {
			throw new Error(`Unable to parse media query "${stringify(...remainder)}"`);
		},
	});
	const mediaQueryListFalsy = parseFromTokens(cloneTokens(remainder), {
		preserveInvalidMediaQueries: true,
		onParseError: () => {
			throw new Error(`Unable to parse media query "${stringify(...remainder) }"`);
		},
	});

	for (let i = 0; i < mediaQueryListFalsy.length; i++) {
		mediaQueryListFalsy[i] = mediaQueryListFalsy[i].negateQuery();
	}

	return {
		name: name,
		truthy: mediaQueryListTruthy,
		falsy: mediaQueryListFalsy,
		dependencies: Array.from(customMediaReferences).map((x) => {
			return [name, x];
		}),
	};
}
