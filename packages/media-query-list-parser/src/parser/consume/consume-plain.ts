import { CSSToken, TokenIdent, TokenType } from '@csstools/css-tokenizer';
import { MediaFeatureName } from '../../nodes/media-feature-name';
import { MediaFeaturePlain } from '../../nodes/media-feature-plain';
import { consumeValue } from './consume-value';

export function consumePlain(tokens: Array<CSSToken>): { node: MediaFeaturePlain, tokens: Array<CSSToken> } | null {
	let name: MediaFeatureName | null = null;
	const value: MediaFeatureValue | null = null;

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];

		if (i === 0) {
			if (token[0] === TokenType.OpenParen) {
				continue;
			} else {
				return null;
			}
		}

		if (token[0] === TokenType.CloseParen) {
			continue;
		}

		if (token[0] === TokenType.Comment || token[0] === TokenType.Whitespace) {
			continue;
		}

		if (token[0] === TokenType.Ident) {
			if (!name) {
				name = new MediaFeatureName(tokens.slice(0, i + 1));
				continue;
			} else {
				return null;
			}
		}

		if (token[0] === TokenType.Delim && token[1] === ':' && name) {
			const value = consumeValue(tokens.slice(i + 1));
		}

		return null;
	}
}
