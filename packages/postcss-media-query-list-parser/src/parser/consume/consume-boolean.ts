import { CSSToken, TokenIdent, TokenType } from '@csstools/css-tokenizer';
import { MediaFeatureBoolean } from '../../nodes/media-feature-boolean';

export function consumeBoolean(tokens: Array<CSSToken>): { node: MediaFeatureBoolean, tokens: Array<CSSToken> } | null {
	let ident : TokenIdent|null = null;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (i === 0) {
			if (token[0] === TokenType.OpenParen) {
				continue;
			}

			return null;
		}

		if (token[0] === TokenType.Comment || token[0] === TokenType.Whitespace) {
			continue;
		}

		if (token[0] === TokenType.Ident) {
			if (!ident) {
				ident = token as TokenIdent;
				continue;
			}

			return null;
		}

		if (token[0] === TokenType.CloseParen) {
			if (ident) {
				const node = new MediaFeatureBoolean(tokens.slice(0, i + 1));

				return {
					node: node,
					tokens: tokens.slice(i + 1),
				};
			}

			return null;
		}

		return null;
	}
}
