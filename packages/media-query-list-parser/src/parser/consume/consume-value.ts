import { CSSToken } from '@csstools/css-tokenizer';
import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { MediaFeatureValue } from '../../nodes/media-feature-value';

export function consumeValue(tokens: Array<CSSToken>): { node: MediaFeatureValue, tokens: Array<CSSToken> } | null {
	const result = parseComponentValue(tokens, {
		onParseError(err) {
			throw new Error(JSON.stringify(err));
		},
	});

	return {
		node: new MediaFeatureValue(result),
		tokens: tokens.slice(result.tokens().length + 1),
	};
}
