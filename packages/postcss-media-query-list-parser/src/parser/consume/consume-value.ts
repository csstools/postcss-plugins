import { CSSToken } from '@csstools/css-tokenizer';
import { MediaFeatureValue } from '../../nodes/media-feature-value';
import { advanceComponentValue } from '../advance/advance';

export function consumeValue(tokens: Array<CSSToken>): { node: MediaFeatureValue, tokens: Array<CSSToken> } | null {
	const result = advanceComponentValue(tokens);

	return {
		node: new MediaFeatureValue(tokens.slice(0, result + 1)),
		tokens: tokens.slice(result + 1),
	};
}
