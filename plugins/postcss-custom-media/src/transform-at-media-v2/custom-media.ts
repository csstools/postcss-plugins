import { stringify, TokenIdent, TokenType } from '@csstools/css-tokenizer';
import { NodeType, parse, MediaCondition, MediaInParens, MediaQueryWithoutType, MediaQueryWithType, MediaNot } from '@csstools/media-query-list-parser';
import { atMediaParamsTokens } from '../transform-at-media/at-media-params-tokens';

export function parseCustomMedia(params: string): { name: string, truthy: string, falsy: string, dependsOn: Array<[string, string]> } | false {
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

	const mediaQueryListTruthy = parse(stringify(...remainder));
	const mediaQueryListFalsy = parse(stringify(...remainder));

	for (let i = 0; i < mediaQueryListFalsy.length; i++) {
		const mediaQuery = mediaQueryListFalsy[i];
		if (mediaQuery.type === NodeType.MediaQueryWithType) {
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
		}

		if (mediaQuery.type === NodeType.MediaQueryWithoutType) {
			const mediaCondition = (mediaQuery as MediaQueryWithoutType).media;
			if (mediaCondition.media.type === NodeType.MediaNot) {
				const query = new MediaQueryWithoutType(
					new MediaCondition(
						((mediaQuery as MediaQueryWithoutType).media as MediaNot).media,
					),
				);

				mediaQueryListFalsy[i] = query;
				continue;
			}

			const query = new MediaQueryWithoutType(
				new MediaNot(
					[
						[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
					],
					new MediaInParens(
						(mediaQuery as MediaQueryWithoutType).media,
						[[TokenType.Whitespace, ' ', 0, 0, null],[TokenType.OpenParen, '(', 0, 0, null]],
						[[TokenType.CloseParen, ')', 0, 0, null]],
					),
				),
			);

			mediaQueryListFalsy[i] = query;
			continue;
		}
	}

	return {
		name: name,
		truthy: mediaQueryListTruthy.map((x) => x.toString().trim()).join(','),
		falsy: mediaQueryListFalsy.map((x) => x.toString().trim()).join(','),
		dependsOn: Array.from(customMediaReferences).map((x) => {
			return [x, name];
		}),
	};
}
