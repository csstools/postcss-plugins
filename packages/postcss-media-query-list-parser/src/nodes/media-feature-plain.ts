import { MediaFeatureName } from './media-feature-name';
import { MediaFeatureValue } from './media-feature-value';

export class MediaFeaturePlain {
	type = 'mf-plain';

	name: MediaFeatureName;
	value: MediaFeatureValue;

	constructor(name: MediaFeatureName, value: MediaFeatureValue) {
		this.name = name;
		this.value = value;
	}

	toString() {
		return this.name.toString() + ':' + this.value.toString();
	}
}
