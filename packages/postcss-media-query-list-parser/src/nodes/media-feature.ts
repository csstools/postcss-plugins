import { MediaFeatureBoolean } from './media-feature-boolean';
import { MediaFeaturePlain } from './media-feature-plain';
import { MediaFeatureRange } from './media-feature-range';

export class MediaFeature {
	type = 'media-feature';

	feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;

	constructor(feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange) {
		this.feature = feature;
	}

	toString() {
		return '(' + this.feature.toString() + ')';
	}
}
