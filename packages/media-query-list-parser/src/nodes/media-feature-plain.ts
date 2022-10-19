import { stringify, TokenColon } from '@csstools/css-tokenizer';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeatureValue, MediaFeatureValueWalkerEntry, MediaFeatureValueWalkerParent } from './media-feature-value';

export class MediaFeaturePlain {
	type = 'mf-plain';

	name: MediaFeatureName;
	colon: TokenColon;
	value: MediaFeatureValue;

	constructor(name: MediaFeatureName, colon: TokenColon, value: MediaFeatureValue) {
		this.name = name;
		this.colon = colon;
		this.value = value;
	}

	tokens() {
		return [
			...this.name.tokens(),
			this.colon,
			...this.value.tokens(),
		];
	}

	toString() {
		return this.name.toString() + stringify(this.colon) + this.value.toString();
	}

	indexOf(item: MediaFeatureName | MediaFeatureValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		if (item === this.value) {
			return 'value';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'value') {
			return this.value;
		}
	}

	walk(cb: (entry: { node: MediaFeaturePlainWalkerEntry, parent: MediaFeaturePlainWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.value, parent: this }, 'value') === false) {
			return false;
		}

		return this.value.walk(cb);
	}
}

export type MediaFeaturePlainWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
export type MediaFeaturePlainWalkerParent = MediaFeatureValueWalkerParent | MediaFeaturePlain;
