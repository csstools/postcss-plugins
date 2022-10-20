import { ComponentValue, ContainerNode, TokenNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { GeneralEnclosed } from './general-enclosed';
import { MediaAnd } from './media-and';
import { MediaCondition } from './media-condition';
import { MediaConditionList } from './media-condition-list';
import { MediaFeature } from './media-feature';
import { MediaFeatureBoolean } from './media-feature-boolean';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeaturePlain } from './media-feature-plain';
import { MediaFeatureRange } from './media-feature-range';
import { MediaFeatureValue } from './media-feature-value';

export class MediaInParens {
	type = 'media-in-parens';

	media: MediaCondition | MediaFeature | GeneralEnclosed;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(media: MediaCondition | MediaFeature | GeneralEnclosed, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.media = media;
		this.before = before;
		this.after = after;
	}

	tokens() {
		return [
			...this.before,
			...this.media.tokens(),
			...this.after,
		];
	}

	toString() {
		return stringify(...this.before) + this.media.toString() + stringify(...this.after);
	}

	indexOf(item: MediaCondition | MediaFeature | GeneralEnclosed): number | string {
		if (item === this.media) {
			return 'media';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'media') {
			return this.media;
		}
	}

	walk(cb: (entry: { node: MediaInParensWalkerEntry, parent: MediaInParensWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		if ('walk' in this.media) {
			return this.media.walk(cb);
		}
	}
}

export type MediaInParensWalkerEntry = ComponentValue | Array<ComponentValue> | GeneralEnclosed | MediaAnd | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | GeneralEnclosed | MediaInParens;
export type MediaInParensWalkerParent = ContainerNode | GeneralEnclosed | MediaAnd | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | GeneralEnclosed | MediaInParens;
