import { stringify, TokenType, TokenIdent } from '@csstools/css-tokenizer';
import { alwaysTrue, neverTrue } from './always-true-or-false';
import { isGeneralEnclosed, isMediaAnd, isMediaConditionList, isMediaFeatureBoolean, isMediaNot, isMediaOr, isMediaQueryInvalid, isMediaQueryWithType, MediaQuery, parse } from '@csstools/media-query-list-parser';

export function transformAtMediaListTokens(params: string, replacements: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }>): Array<{ replaceWith: string, encapsulateWith?: string }> {
	const mediaQueries = parse(params, { preserveInvalidMediaQueries: true });

	const stringQueries = mediaQueries.map((x) => x.toString());

	for (let i = 0; i < mediaQueries.length; i++) {
		const mediaQuery = mediaQueries[i];
		const original = stringQueries[i];

		{
			const transformedQuery = transformSimpleMediaQuery(mediaQuery, replacements);
			if (transformedQuery && transformedQuery.replaceWith !== original) {
				return stringQueries.map((query, index) => {
					if (index === i) {
						return transformedQuery;
					}

					return {
						replaceWith: query,
					};
				});
			}
		}

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

export function transformSimpleMediaQuery(mediaQuery: MediaQuery, replacements: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }>): { replaceWith: string, encapsulateWith?: string } | null {
	if (!mediaQueryIsSimple(mediaQuery)) {
		return null;
	}

	let candidate: { replaceWith: string, encapsulateWith?: string } | null = null;

	mediaQuery.walk((entry) => {
		const node = entry.node;
		if (!isMediaFeatureBoolean(node)) {
			return;
		}

		const name = node.getName();
		if (!name.startsWith('--')) {
			return false;
		}

		const replacement = replacements.get(name);
		if (replacement) {
			candidate = {
				replaceWith: replacement.truthy.map((x) => x.toString().trim()).join(','),
			};

			return false;
		}
	});

	return candidate;
}

function mediaQueryIsSimple(mediaQuery: MediaQuery): boolean {
	if (isMediaQueryInvalid(mediaQuery)) {
		return false;
	}

	if (isMediaQueryWithType(mediaQuery)) {
		return false;
	}

	let isSimple = true;
	mediaQuery.walk((entry) => {
		if (
			isMediaAnd(entry.node) ||
			isMediaOr(entry.node) ||
			isMediaNot(entry.node) ||
			isMediaConditionList(entry.node) ||
			isGeneralEnclosed(entry.node)
		) {
			isSimple = false;
			return false;
		}
	});

	return isSimple;
}

export function transformAtMediaTokens(mediaQuery: MediaQuery, replacements: Map<string, { truthy: Array<MediaQuery>, falsy: Array<MediaQuery> }>): Array<{replaceWith: string, encapsulateWith?: string}> {
	const tokens = mediaQuery.tokens();

	// replacement slot is in a complex @media query :
	// - @media not (--custom-mq) { ... }
	// - @media ((--custom-mq-1) or (--custom-mq-2) or (not (--custom-mq-3))) { ... }
	for (let i = 0; i < tokens.length; i++) {
		switch (tokens[i][0]) {
			case TokenType.Function: {
				let depth = 1;
				while (depth !== 0) {
					i++;
					if (!tokens[i] || tokens[i][0] === TokenType.EOF) {
						throw new Error('unexpected EOF');
					}

					switch (tokens[i][0]) {
						case TokenType.OpenParen:
						case TokenType.Function:
							depth++;
							break;
						case TokenType.CloseParen:
							depth--;
							break;
					}
				}
				break;
			}

			case TokenType.OpenCurly: {
				let depth = 1;
				while (depth !== 0) {
					i++;
					if (!tokens[i] || tokens[i][0] === TokenType.EOF) {
						throw new Error('unexpected EOF');
					}

					switch (tokens[i][0]) {
						case TokenType.OpenCurly:
							depth++;
							break;
						case TokenType.CloseCurly:
							depth--;
							break;
					}
				}
				break;
			}

			case TokenType.OpenSquare: {
				let depth = 1;
				while (depth !== 0) {
					i++;
					if (!tokens[i] || tokens[i][0] === TokenType.EOF) {
						throw new Error('unexpected EOF');
					}

					switch (tokens[i][0]) {
						case TokenType.OpenSquare:
							depth++;
							break;
						case TokenType.CloseSquare:
							depth--;
							break;
					}
				}
				break;
			}

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
							encapsulateWith: replacement.truthy.map((x) => x.toString().trim()).join(','),
						},
						{
							replaceWith: stringify(...replaceWithFalse),
							encapsulateWith: replacement.falsy.map((x) => x.toString().trim()).join(','),
						},
					];
				}

				break;
			}
		}
	}

	return [];
}
