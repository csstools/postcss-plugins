import { tokenizer, stringify, TokenType, NumberType, TokenIdent } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer';

export function atMediaParamsTokens(params: string): Array<CSSToken> {
	const t = tokenizer({
		css: params,
	}, {
		commentsAreTokens: true, onParseError: () => {
			throw new Error(`Unable to parse media query "${params}"`);
		},
	});

	const tokens: Array<CSSToken> = [];
	while (!t.endOfFile()) {
		tokens.push(t.nextToken());
	}

	return tokens;
}

const alwaysTrue: Array<CSSToken> = [
	[TokenType.Ident, 'max-color', 0, 0, { value: 'max-color' }],
	[TokenType.Colon, ':', 0, 0, undefined],
	[TokenType.Number, '2147477350', 0, 0, { value: 9999943, type: NumberType.Integer }],
];

const neverTrue: Array<CSSToken> = [
	[TokenType.Ident, 'color', 0, 0, { value: 'color' }],
	[TokenType.Colon, ':', 0, 0, undefined],
	[TokenType.Number, '2147477350', 0, 0, { value: 9999943, type: NumberType.Integer }],
];

export function transformAtMediaListTokens(params: string, replacements: Map<string, { truthy: string, falsy: string }>): Array<{ replaceWith: string, encapsulateWith?: string }> {
	const mediaQueries = splitMediaQueryList(atMediaParamsTokens(params));

	const stringQueries = mediaQueries.map((x) => stringify(...x));

	for (let i = 0; i < mediaQueries.length; i++) {
		const mediaQuery = mediaQueries[i];
		const original = stringQueries[i];

		const transformedQuery = transformAtMediaTokens(mediaQuery, replacements);
		if (!transformedQuery || transformedQuery.length === 0) {
			continue;
		}

		if (transformedQuery[0].replaceWith === original) {
			continue;
		}

		return stringQueries.flatMap((query, index) => {
			if (index === i) {
				return transformedQuery;
			}

			return [{
				replaceWith: query,
			}];
		});
	}

	return [];
}

export function transformAtMediaTokens(tokens: Array<CSSToken>, replacements: Map<string, { truthy: string, falsy: string }>): Array<{replaceWith: string, encapsulateWith?: string}> {
	const tokenTypes: Set<string> = new Set();
	let identCounter = 0;
	for (let i = 0; i < tokens.length; i++) {
		tokenTypes.add(tokens[i][0]);
		if (tokens[i][0] === TokenType.Ident) {
			identCounter++;
		}
	}

	tokenTypes.delete(TokenType.Comment);
	tokenTypes.delete(TokenType.Whitespace);
	tokenTypes.delete(TokenType.OpenParen);
	tokenTypes.delete(TokenType.CloseParen);
	tokenTypes.delete(TokenType.Ident);

	// replacement slot is a simple @media query :
	// - @media (--custom-mq) { ... }
	// - @media ((--custom-mq)) { ... }
	if (tokenTypes.size == 0 && identCounter === 1) {
		let parenDepth = 0;
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i][0] === TokenType.OpenParen) {
				parenDepth++;
				continue;
			}
			if (tokens[i][0] === TokenType.CloseParen) {
				parenDepth--;
				continue;
			}

			if (tokens[i][0] === TokenType.Ident && parenDepth > 0) {
				const identToken = tokens[i] as TokenIdent;

				if (replacements.has(identToken[4].value)) {
					return [{
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						replaceWith: replacements.get(identToken[4].value)!.truthy,
					}];
				} else {
					return [];
				}
			}
		}
	}

	let functionDepth = 0;

	for (let i = 0; i < tokens.length; i++) {
		switch (tokens[i][0]) {
			case TokenType.Function:
				functionDepth++;
				while (functionDepth !== 0) {
					i++;
					switch (tokens[i][0]) {
						case TokenType.OpenParen:
						case TokenType.Function:
							functionDepth++;
							break;
						case TokenType.CloseParen:
							functionDepth--;
							break;
						case TokenType.EOF:
							throw new Error('unexpected EOF');
						default:
							break;
					}
				}
				break;

			case TokenType.Ident: {
				const identToken = tokens[i] as TokenIdent;

				if (!replacements.has(identToken[4].value)) {
					break;
				}

				let isValid = true;
				for (let p = i-1; p>= 0; p--) {
					if (tokens[p][0] === TokenType.Comment || tokens[p][0] === TokenType.Whitespace) {
						continue;
					}

					if (tokens[p][0] === TokenType.OpenParen) {
						break;
					}

					isValid = false;
					break;
				}

				for (let n = i + 1; n < tokens.length; n++) {
					if (tokens[n][0] === TokenType.Comment || tokens[n][0] === TokenType.Whitespace) {
						continue;
					}

					if (tokens[n][0] === TokenType.CloseParen) {
						break;
					}

					isValid = false;
					break;
				}

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const replacement = replacements.get(identToken[4].value)!;

				if (isValid) {
					const replaceWithTrue = tokens.slice();
					replaceWithTrue.splice(i, 1, ...alwaysTrue);

					const replaceWithFalse = tokens.slice();
					replaceWithFalse.splice(i, 1, ...neverTrue);

					return [
						{
							replaceWith: stringify(...replaceWithTrue),
							encapsulateWith: replacement.truthy,
						},
						{
							replaceWith: stringify(...replaceWithFalse),
							encapsulateWith: replacement.falsy,
						},
					];
				}

				break;
			}
			default:
				break;
		}
	}

	return [];
}

export function parseCustomMedia(params: string): {name: string, truthy: string, falsy: string, dependsOn: Array<[string, string]>}|false {
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
		const mediaQuery = list[i];

		const truthy = stringify(...handleTrueAndFalseTokens(mediaQuery));

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
			falsy.splice(j, 0,
				[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
				[TokenType.Whitespace, ' ', 0, 0, undefined],
			);

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

export function handleTrueAndFalseTokens(tokens: Array<CSSToken>): Array<CSSToken> {
	let booleanToken;

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i][0] === TokenType.Comment) {
			continue;
		}
		if (tokens[i][0] === TokenType.Whitespace) {
			continue;
		}

		if (tokens[i][0] !== TokenType.Ident) {
			return tokens;
		}

		if (booleanToken) {
			return tokens;
		}

		const identToken = tokens[i] as TokenIdent;
		if (identToken[4].value.toLowerCase() === 'true') {
			booleanToken = 'true';
			continue;
		}

		if (identToken[4].value.toLowerCase() === 'false') {
			booleanToken = 'false';
			continue;
		}

		return tokens;
	}

	if (!booleanToken) {
		return tokens;
	}

	if (booleanToken === 'true') {
		return [
			[TokenType.OpenParen, '(', 0, 0, undefined],
			...alwaysTrue,
			[TokenType.CloseParen, ')', 0, 0, undefined],
		];
	}

	return [
		[TokenType.OpenParen, '(', 0, 0, undefined],
		...neverTrue,
		[TokenType.CloseParen, ')', 0, 0, undefined],
	];
}

export function splitMediaQueryList(tokens: Array<CSSToken>): Array<Array<CSSToken>> {
	let parenDepth = 0;
	let squareDepth = 0;
	let curlyDepth = 0;
	let depth = 0;

	const listItems = [];
	let lastSliceIndex = 0;

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i][0] === TokenType.OpenParen || tokens[i][0] === TokenType.Function) {
			depth++;
			parenDepth++;
		}
		if (tokens[i][0] === TokenType.CloseParen && parenDepth > 0) {
			depth--;
			parenDepth--;
		}

		if (tokens[i][0] === TokenType.OpenCurly) {
			depth++;
			curlyDepth++;
		}
		if (tokens[i][0] === TokenType.CloseParen && curlyDepth > 0) {
			depth--;
			curlyDepth--;
		}

		if (tokens[i][0] === TokenType.OpenSquare) {
			depth++;
			squareDepth++;
		}
		if (tokens[i][0] === TokenType.CloseSquare && squareDepth > 0) {
			depth--;
			squareDepth--;
		}

		if (tokens[i][0] === TokenType.Comma && depth === 0) {
			listItems.push(tokens.slice(lastSliceIndex, i));
			lastSliceIndex = i + 1;
		}
	}

	if (lastSliceIndex === 0) {
		return [tokens];
	}

	listItems.push(tokens.slice(lastSliceIndex));
	return listItems;
}
