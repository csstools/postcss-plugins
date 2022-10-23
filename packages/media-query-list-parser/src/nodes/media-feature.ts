import { SimpleBlockNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { MediaFeatureBoolean, parseMediaFeatureBoolean } from './media-feature-boolean';
import { MediaFeaturePlain, MediaFeaturePlainWalkerEntry, MediaFeaturePlainWalkerParent, parseMediaFeaturePlain } from './media-feature-plain';
import { MediaFeatureRange, MediaFeatureRangeWalkerEntry, MediaFeatureRangeWalkerParent, parseMediaFeatureRange } from './media-feature-range';

export class MediaFeature {
	type = 'media-feature';

	feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;

	constructor(feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange) {
		this.feature = feature;
	}

	tokens() {
		return this.feature.tokens();
	}

	toString() {
		return this.feature.toString();
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

export function parseMediaFeature(simpleBlock: SimpleBlockNode) {
	if (simpleBlock.startToken[0] !== TokenType.OpenParen) {
		return false;
	}

	const boolean = parseMediaFeatureBoolean(simpleBlock.value);
	if (boolean !== false) {
		return new MediaFeature(boolean);
	}

	const plain = parseMediaFeaturePlain(simpleBlock.value);
	if (plain !== false) {
		return new MediaFeature(plain);
	}

	const range = parseMediaFeatureRange(simpleBlock.value);
	if (range !== false) {
		return new MediaFeature(range);
	}

	return false;
}
