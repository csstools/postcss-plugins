import { CSSToken } from '@csstools/css-tokenizer';
import { MediaConditionListWithAnd, MediaConditionListWithAndWalkerEntry, MediaConditionListWithAndWalkerParent, MediaConditionListWithOr, MediaConditionListWithOrWalkerEntry, MediaConditionListWithOrWalkerParent } from './media-condition-list';
import { MediaInParens } from './media-in-parens';
import { MediaNot, MediaNotWalkerEntry, MediaNotWalkerParent } from './media-not';
import { NodeType } from '../util/node-type';

export class MediaCondition {
	type = NodeType.MediaCondition;

	media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr;

	constructor(media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr) {
		this.media = media;
	}

	tokens(): Array<CSSToken> {
		return this.media.tokens();
	}

	toString(): string {
		return this.media.toString();
	}

	indexOf(item: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr): number | string {
		if (item === this.media) {
			return 'media';
		}

		return -1;
	}

	at(index: number | string): MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr | undefined {
		if (index === 'media') {
			return this.media;
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaConditionWalkerEntry, parent: MediaConditionWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.media, parent: this, state: stateClone }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb, stateClone);
	}

	toJSON(): unknown {
		return {
			type: this.type,
			media: this.media.toJSON(),
		};
	}

	isMediaCondition(): this is MediaCondition {
		return MediaCondition.isMediaCondition(this);
	}

	static isMediaCondition(x: unknown): x is MediaCondition {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaCondition)) {
			return false;
		}

		return x.type === NodeType.MediaCondition;
	}
}

export type MediaConditionWalkerEntry = MediaNotWalkerEntry | MediaConditionListWithAndWalkerEntry | MediaConditionListWithOrWalkerEntry | MediaNot | MediaConditionListWithAnd | MediaConditionListWithOr;
export type MediaConditionWalkerParent = MediaNotWalkerParent | MediaConditionListWithAndWalkerParent | MediaConditionListWithOrWalkerParent | MediaCondition;
