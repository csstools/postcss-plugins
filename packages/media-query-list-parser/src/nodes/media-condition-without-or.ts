import { MediaConditionListWithAnd, MediaConditionListWithAndWalkerEntry, MediaConditionListWithAndWalkerParent } from './media-condition-list';
import { MediaNot, MediaNotWalkerEntry, MediaNotWalkerParent } from './media-not';

export class MediaConditionWithoutOr {
	type = 'media-condition-without-or';

	media: MediaNot | MediaConditionListWithAnd;

	constructor(media: MediaNot | MediaConditionListWithAnd) {
		this.media = media;
	}

	tokens() {
		return this.media.tokens();
	}

	toString() {
		return this.media.toString();
	}

	indexOf(item: MediaNot | MediaConditionListWithAnd): number | string {
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

	walk(cb: (entry: { node: MediaConditionWithoutOrWalkerEntry, parent: MediaConditionWithoutOrWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}
}

export type MediaConditionWithoutOrWalkerEntry = MediaConditionListWithAndWalkerEntry | MediaNotWalkerEntry | MediaNot | MediaConditionListWithAnd;
export type MediaConditionWithoutOrWalkerParent = MediaConditionListWithAndWalkerParent | MediaNotWalkerParent | MediaConditionWithoutOr;
