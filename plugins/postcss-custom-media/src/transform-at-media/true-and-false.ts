import { TokenType, TokenIdent } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer';
import { alwaysTrue, neverTrue } from './always-true-or-false';

export function replaceTrueAndFalseTokens(tokens: Array<CSSToken>): Array<CSSToken> {
	let booleanToken;
	let remainder : Array<CSSToken> = [];

	for (let i = 0; i < tokens.length; i++) {
		if (tokens[i][0] === TokenType.Comment) {
			continue;
		}
		if (tokens[i][0] === TokenType.Whitespace) {
			continue;
		}

		if (tokens[i][0] === TokenType.Ident) {
			const identToken = tokens[i] as TokenIdent;
			if (identToken[4].value.toLowerCase() === 'true') {
				booleanToken = 'true';
				remainder = tokens.slice(i + 1);
				break;
			}

			if (identToken[4].value.toLowerCase() === 'false') {
				booleanToken = 'false';
				remainder = tokens.slice(i + 1);
				break;
			}
		}

		return tokens;
	}

	if (!booleanToken) {
		return tokens;
	}

	{
		// Nothing is allowed after true|false except for comments and whitespace
		for (let i = 0; i < remainder.length; i++) {
			if (remainder[i][0] === TokenType.Comment) {
				continue;
			}
			if (remainder[i][0] === TokenType.Whitespace) {
				continue;
			}

			return tokens;
		}
	}

	if (booleanToken === 'true') {
		return [
			[TokenType.Whitespace, ' ', 0, 0, undefined],
			[TokenType.OpenParen, '(', 0, 0, undefined],
			...alwaysTrue,
			[TokenType.CloseParen, ')', 0, 0, undefined],
		];
	}

	return [
		[TokenType.Whitespace, ' ', 0, 0, undefined],
		[TokenType.OpenParen, '(', 0, 0, undefined],
		...neverTrue,
		[TokenType.CloseParen, ')', 0, 0, undefined],
	];
}
