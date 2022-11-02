import { CSSToken, TokenIdent, TokenType } from '@csstools/css-tokenizer';
import { parseFromTokens, NodeType, MediaCondition, MediaInParens, MediaQueryWithoutType, MediaQueryWithType, MediaNot, MediaQuery } from '@csstools/media-query-list-parser';
import { atMediaParamsTokens } from '../transform-at-media/at-media-params-tokens';
import { replaceTrueAndFalseTokens } from './true-and-false';

export function parseCustomMedia(params: string): { name: string, truthy: Array<MediaQuery>, falsy: Array<MediaQuery>, dependsOn: Array<[string, string]> } | false {
	const tokens = atMediaParamsTokens(params);

	const customMediaReferences: Set<string> = new Set();

	let name = '';
	let remainder = tokens;
	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i][0] === TokenType.Comment) {
			continue;
		}
		if (tokens[i][0] === TokenType.Whitespace) {
			continue;
		}

		if (tokens[i][0] === TokenType.Ident) {
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
		if (remainder[i][0] === TokenType.Ident) {
			const identToken = remainder[i] as TokenIdent;
			if (identToken[4].value.startsWith('--')) {
				customMediaReferences.add(identToken[4].value);
			}
		}
	}

	remainder = replaceTrueAndFalseTokens(remainder);

	const mediaQueryListTruthy = parseFromTokens(cloneTokens(remainder), { preserveInvalidMediaQueries : true });
	const mediaQueryListFalsy = parseFromTokens(cloneTokens(remainder), { preserveInvalidMediaQueries: true });

	for (let i = 0; i < mediaQueryListFalsy.length; i++) {
		mediaQueryListFalsy[i] = mediaQueryListFalsy[i].negateQuery();
	}

	return {
		name: name,
		truthy: mediaQueryListTruthy,
		falsy: mediaQueryListFalsy,
		dependsOn: Array.from(customMediaReferences).map((x) => {
			return [x, name];
		}),
	};
}

function cloneTokens(tokens: Array<CSSToken>): Array<CSSToken> {
	if ('structuredClone' in globalThis) {
		return structuredClone(tokens);
	}

	return JSON.parse(JSON.stringify(tokens));
}
