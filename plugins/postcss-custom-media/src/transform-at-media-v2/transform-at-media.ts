import { stringify, TokenType, TokenIdent } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer';
import { splitMediaQueryList } from './split-media-query-list';
import { alwaysTrue, neverTrue } from './always-true-or-false';
import { atMediaParamsTokens } from './at-media-params-tokens';

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

	// replacement slot is in a simple @media query :
	// - @media (--custom-mq) { ... }
	// - @media ((--custom-mq)) { ... }
	if (tokenTypes.size == 0 && identCounter === 1) {
		let candidate: Array<{ replaceWith: string, encapsulateWith?: string }> | null = null;

		let parenDepth = 0;
		for (let i = 0; i < tokens.length; i++) {
			if (tokens[i][0] === TokenType.Whitespace || tokens[i][0] === TokenType.Comment) {
				continue;
			}

			if (tokens[i][0] === TokenType.CloseParen) {
				if (candidate) {
					return candidate;
				}
			}

			candidate = null;

			if (tokens[i][0] === TokenType.CloseParen) {
				parenDepth--;
				continue;
			}
			if (tokens[i][0] === TokenType.OpenParen) {
				parenDepth++;
				continue;
			}

			if (tokens[i][0] === TokenType.Ident && parenDepth > 0) {
				const identToken = tokens[i] as TokenIdent;

				if (replacements.has(identToken[4].value)) {
					candidate = [{
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						replaceWith: replacements.get(identToken[4].value)!.truthy,
					}];
				}
			}
		}

		return [];
	}

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
		}
	}

	return [];
}
