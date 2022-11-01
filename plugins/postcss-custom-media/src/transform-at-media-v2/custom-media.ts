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
		const mediaQuery = mediaQueryListFalsy[i];

		if (mediaQuery.type === NodeType.MediaQueryInvalid || mediaQuery.toString().trim() === '') {
			mediaQueryListTruthy[i] = new MediaQueryWithType(
				[
					[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
					[TokenType.Whitespace, ' ', 0, 0, undefined],
				],
				[
					[TokenType.Ident, 'all', 0, 0, { value: 'all' }],
				],
				null,
				null,
			);

			mediaQueryListFalsy[i] = new MediaQueryWithType(
				[
					[TokenType.Ident, 'all', 0, 0, { value: 'all' }],
				],
				null,
				null,
			);
		}  else if (mediaQuery.type === NodeType.MediaQueryWithType) {
			const query = mediaQuery as MediaQueryWithType;
			if (query.modifier.length === 0) {
				query.modifier = [
					[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
				];
			} else {
				for (let j = 0; j < query.modifier.length; j++) {
					const token = query.modifier[j];
					if (token[0] === TokenType.Ident && token[4].value.toLowerCase() === 'not') {
						query.modifier = [];
						continue;
					}

					if (token[0] === TokenType.Ident && token[4].value.toLowerCase() === 'only') {
						query.modifier[j][1] = 'not';
						query.modifier[j][4].value = 'not';
						continue;
					}
				}
			}

			mediaQueryListFalsy[i] = query;
			continue;
		} else if (mediaQuery.type === NodeType.MediaQueryWithoutType) {
			let mediaCondition = (mediaQuery as MediaQueryWithoutType).media;
			if (mediaCondition.media.type === NodeType.MediaNot) {
				const query = new MediaQueryWithoutType(
					new MediaCondition(
						(mediaCondition.media as MediaNot).media,
					),
				);

				mediaQueryListFalsy[i] = query;
				continue;
			}

			if (mediaCondition.media.type === NodeType.MediaConditionListWithOr) {
				mediaCondition = new MediaCondition(
					new MediaInParens(
						mediaCondition,
						[
							[TokenType.Whitespace, ' ', 0, 0, undefined],
							[TokenType.OpenParen, '(', 0, 0, undefined],
						],
						[
							[TokenType.CloseParen, ')', 0, 0, undefined],
						],
					),
				);
			}

			const query = new MediaQueryWithType(
				[
					[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
					[TokenType.Whitespace, ' ', 0, 0, undefined],
				],
				[
					[TokenType.Ident, 'all', 0, 0, { value: 'all' }],
					[TokenType.Whitespace, ' ', 0, 0, undefined],
				],
				[
					[TokenType.Ident, 'and', 0, 0, { value: 'and' }],
				],
				mediaCondition,
			);

			mediaQueryListFalsy[i] = query;
			continue;
		}
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
