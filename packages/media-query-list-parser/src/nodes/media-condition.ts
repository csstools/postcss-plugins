import { MediaConditionListWithAnd, MediaConditionListWithAndWalkerEntry, MediaConditionListWithAndWalkerParent, MediaConditionListWithOr, MediaConditionListWithOrWalkerEntry, MediaConditionListWithOrWalkerParent } from './media-condition-list';
import { MediaInParens } from './media-in-parens';
import { MediaNot, MediaNotWalkerEntry, MediaNotWalkerParent } from './media-not';
import { NodeType } from './node-type';

export class MediaCondition {
	type = NodeType.MediaCondition;

	media: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr;

	constructor(media: MediaNot | MediaInParens |MediaConditionListWithAnd | MediaConditionListWithOr) {
		this.media = media;
	}

	tokens() {
		return this.media.tokens();
	}

	toString() {
		return this.media.toString();
	}

	indexOf(item: MediaNot | MediaInParens | MediaConditionListWithAnd | MediaConditionListWithOr): number | string {
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

	walk(cb: (entry: { node: MediaConditionWalkerEntry, parent: MediaConditionWalkerParent }, index: number | string) => boolean | void) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}

	toJSON() {
		return {
			type: this.type,
			media: this.media.toJSON(),
		};
	}
}

export type MediaConditionWalkerEntry = MediaNotWalkerEntry | MediaConditionListWithAndWalkerEntry | MediaConditionListWithOrWalkerEntry | MediaNot | MediaConditionListWithAnd | MediaConditionListWithOr;
export type MediaConditionWalkerParent = MediaNotWalkerParent | MediaConditionListWithAndWalkerParent | MediaConditionListWithOrWalkerParent | MediaCondition;
