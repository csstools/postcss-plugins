import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
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
import { NodeType } from '../util/node-type';
import { MediaNot } from './media-not';
import { MediaOr } from './media-or';

export class MediaInParens {
	type = NodeType.MediaInParens;

	media: MediaCondition | MediaFeature | GeneralEnclosed;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(media: MediaCondition | MediaFeature | GeneralEnclosed, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.media = media;
		this.before = before;
		this.after = after;
	}

	tokens(): Array<CSSToken> {
		return [
			...this.before,
			...this.media.tokens(),
			...this.after,
		];
	}

	toString(): string {
		return stringify(...this.before) + this.media.toString() + stringify(...this.after);
	}

	indexOf(item: MediaCondition | MediaFeature | GeneralEnclosed): number | string {
		if (item === this.media) {
			return 'media';
		}

		return -1;
	}

	at(index: number | string): MediaCondition | MediaFeature | GeneralEnclosed | undefined {
		if (index === 'media') {
			return this.media;
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaInParensWalkerEntry, parent: MediaInParensWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.media, parent: this, state: stateClone }, 'media') === false) {
			return false;
		}

		if ('walk' in this.media) {
			return this.media.walk(cb, stateClone);
		}
	}

	/**
	 * @internal
	 */
	toJSON() {
		return {
			type: this.type,
			media: this.media.toJSON(),
			before: this.before,
			after: this.after,
		};
	}

	/**
	 * @internal
	 */
	isMediaInParens(): this is MediaInParens {
		return MediaInParens.isMediaInParens(this);
	}

	static isMediaInParens(x: unknown): x is MediaInParens {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaInParens)) {
			return false;
		}

		return x.type === NodeType.MediaInParens;
	}
}

export type MediaInParensWalkerEntry = ComponentValue | GeneralEnclosed | MediaAnd | MediaNot | MediaOr | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | GeneralEnclosed | MediaInParens;
export type MediaInParensWalkerParent = ContainerNode | GeneralEnclosed | MediaAnd | MediaNot | MediaOr | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | GeneralEnclosed | MediaInParens;
