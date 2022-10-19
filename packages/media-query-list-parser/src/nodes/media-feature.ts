import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaFeatureBoolean } from './media-feature-boolean';
import { MediaFeaturePlain, MediaFeaturePlainWalkerEntry, MediaFeaturePlainWalkerParent } from './media-feature-plain';
import { MediaFeatureRange, MediaFeatureRangeWalkerEntry, MediaFeatureRangeWalkerParent } from './media-feature-range';

export class MediaFeature {
	type = 'media-feature';

	feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.feature = feature;
		this.before = before;
		this.after = after;
	}

	tokens() {
		return [
			...this.before,
			...this.feature.tokens(),
			...this.after,
		];
	}

	toString() {
		return stringify(...this.before) + this.feature.toString() + stringify(...this.after);
	}

	indexOf(item: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange): number | string {
		if (item === this.feature) {
			return 'feature';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'feature') {
			return this.feature;
		}
	}

	walk(cb: (entry: { node: MediaFeatureWalkerEntry, parent: MediaFeatureWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.feature, parent: this }, 'feature') === false) {
			return false;
		}

		if ('walk' in this.feature) {
			return this.feature.walk(cb);
		}
	}
}

export type MediaFeatureWalkerEntry = MediaFeaturePlainWalkerEntry | MediaFeatureRangeWalkerEntry | MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;
export type MediaFeatureWalkerParent = MediaFeaturePlainWalkerParent | MediaFeatureRangeWalkerParent | MediaFeature;
