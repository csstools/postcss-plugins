import { TokenType, TokenIdent } from '@csstools/css-tokenizer';
import type { CSSToken } from '@csstools/css-tokenizer';

export function topLevelCombinationKeywords(tokens: Array<CSSToken>): Set<string> {
	const keywords: Set<string> = new Set();

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
				switch (identToken[4].value.toLowerCase()) {
					case 'not':
						keywords.add('not');
						break;
					case 'and':
						keywords.add('and');
						break;
					case 'or':
						keywords.add('or');
						break;
				}

				break;
			}
		}
	}

	return keywords;
}
