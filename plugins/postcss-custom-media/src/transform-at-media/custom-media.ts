import { stringify, TokenType, TokenIdent } from '@csstools/css-tokenizer';
import { topLevelCombinationKeywords } from './top-level-combination-keywords';
import { splitMediaQueryList } from './split-media-query-list';
import { replaceTrueAndFalseTokens } from './true-and-false';
import { atMediaParamsTokens } from './at-media-params-tokens';

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

	const list = splitMediaQueryList(remainder);
	const truthyParts = [];
	const falsyParts = [];

	MEDIA_QUERY_LIST_LOOP:
	for (let i = 0; i < list.length; i++) {
		const mediaQuery = replaceTrueAndFalseTokens(list[i]);

		const truthy = stringify(...mediaQuery);

		for (let j = 0; j < mediaQuery.length; j++) {
			if (mediaQuery[j][0] === TokenType.Comment) {
				continue;
			}
			if (mediaQuery[j][0] === TokenType.Whitespace) {
				continue;
			}

			if (mediaQuery[j][0] === TokenType.Ident) {
				const identToken = mediaQuery[j] as TokenIdent;
				if (identToken[4].value.toLowerCase() === 'not') {
					truthyParts.push(truthy);

					const falsy = mediaQuery.slice();
					falsy.splice(j, 1);

					falsyParts.push(stringify(...falsy));
					continue MEDIA_QUERY_LIST_LOOP;
				}

				if (identToken[4].value.toLowerCase() === 'only') {
					mediaQuery[j][1] = 'not';
					mediaQuery[j][4].value = 'not';

					truthyParts.push(truthy);
					falsyParts.push(stringify(...mediaQuery));
					continue MEDIA_QUERY_LIST_LOOP;
				}
			}

			const falsy = mediaQuery.slice();

			const falsyRemainder = falsy.slice(j);
			const falsyRemainderKeywords = topLevelCombinationKeywords(falsyRemainder);
			falsyRemainderKeywords.delete('not');

			if (falsyRemainderKeywords.size > 0) {
				falsy.splice(j, 0,
					[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
					[TokenType.Whitespace, ' ', 0, 0, undefined],
					[TokenType.OpenParen, '(', 0, 0, undefined],
				);
				falsy.push(
					[TokenType.CloseParen, ')', 0, 0, undefined],
				);
			} else {
				falsy.splice(j, 0,
					[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
					[TokenType.Whitespace, ' ', 0, 0, undefined],
				);
			}

			truthyParts.push(truthy);
			falsyParts.push(stringify(...falsy));
			continue MEDIA_QUERY_LIST_LOOP;
		}

		truthyParts.push(truthy);
		falsyParts.push('not all');
		continue MEDIA_QUERY_LIST_LOOP;
	}

	return {
		name: name,
		truthy: truthyParts.map((x) => x.trim()).join(','),
		falsy: falsyParts.map((x) => x.trim()).join(','),
		dependsOn: Array.from(customMediaReferences).map((x) => {
			return [x, name];
		}),
	};
}
