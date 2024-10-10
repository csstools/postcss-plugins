import type { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import type { CSSToken} from '@csstools/css-tokenizer';
import { isTokenWhiteSpaceOrComment, stringify } from '@csstools/css-tokenizer';
import type { GeneralEnclosed } from './general-enclosed';
import type { MediaAnd } from './media-and';
import type { MediaCondition } from './media-condition';
import type { MediaConditionList } from './media-condition-list';
import type { MediaFeature } from './media-feature';
import type { MediaFeatureBoolean } from './media-feature-boolean';
import type { MediaFeatureName } from './media-feature-name';
import type { MediaFeaturePlain } from './media-feature-plain';
import type { MediaFeatureRange } from './media-feature-range';
import type { MediaFeatureValue } from './media-feature-value';
import { NodeType } from '../util/node-type';
import type { MediaNot } from './media-not';
import type { MediaOr } from './media-or';

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

	/**
	 * @internal
	 */
	hasLeadingSpace(): boolean {
		if (!this.before.length) {
			return this.media.hasLeadingSpace();
		}

		return isTokenWhiteSpaceOrComment(this.before[0]);
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
	toJSON(): Record<string, unknown> {
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

export type MediaInParensWalkerEntry = ComponentValue | GeneralEnclosed | MediaAnd | MediaNot | MediaOr | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | MediaInParens;
export type MediaInParensWalkerParent = ContainerNode | GeneralEnclosed | MediaAnd | MediaNot | MediaOr | MediaConditionList | MediaCondition | MediaFeatureBoolean | MediaFeatureName | MediaFeaturePlain | MediaFeatureRange | MediaFeatureValue | MediaFeature | MediaInParens;
