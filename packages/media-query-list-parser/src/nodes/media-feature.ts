import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaFeatureBoolean } from './media-feature-boolean';
import { MediaFeaturePlain } from './media-feature-plain';
import { MediaFeatureRange } from './media-feature-range';

export class MediaFeature {
	type = 'media-feature';

	feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;

	startToken: CSSToken;
	endToken: CSSToken;

	constructor(feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange, startToken: CSSToken, endToken: CSSToken) {
		this.startToken = startToken;
		this.endToken = endToken;
		this.feature = feature;
	}

	toString() {
		return stringify(this.startToken) + this.feature.toString() + stringify(this.endToken);
	}
}
