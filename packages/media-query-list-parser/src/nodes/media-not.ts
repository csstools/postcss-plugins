import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent } from './media-in-parens';

export class MediaNot {
	type = 'media-not';

	modifier: Array<CSSToken>;
	media: MediaInParens;

	constructor(modifier: Array<CSSToken>, media: MediaInParens) {
		this.modifier = modifier;
		this.media = media;
	}

	tokens() {
		return [
			...this.modifier,
			...this.media.tokens(),
		];
	}

	toString() {
		return stringify(...this.modifier) + this.media.toString();
	}

	indexOf(item: MediaInParens): number | string {
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

	walk(cb: (entry: { node: MediaNotWalkerEntry, parent: MediaNotWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}
}

export type MediaNotWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaNotWalkerParent = MediaInParensWalkerParent | MediaNot;
