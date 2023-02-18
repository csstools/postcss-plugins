import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent } from './media-in-parens';
import { NodeType } from '../util/node-type';

export class MediaNot {
	type = NodeType.MediaNot;

	modifier: Array<CSSToken>;
	media: MediaInParens;

	constructor(modifier: Array<CSSToken>, media: MediaInParens) {
		this.modifier = modifier;
		this.media = media;
	}

	tokens(): Array<CSSToken> {
		return [
			...this.modifier,
			...this.media.tokens(),
		];
	}

	toString(): string {
		return stringify(...this.modifier) + this.media.toString();
	}

	indexOf(item: MediaInParens): number | string {
		if (item === this.media) {
			return 'media';
		}

		return -1;
	}

	at(index: number | string): MediaInParens | undefined {
		if (index === 'media') {
			return this.media;
		}
	}

	walk(cb: (entry: { node: MediaNotWalkerEntry, parent: MediaNotWalkerParent }, index: number | string) => boolean | void): false | undefined {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}

	toJSON() {
		return {
			type: this.type,
			modifier: this.modifier,
			media: this.media.toJSON(),
		};
	}

	isMediaNot(): this is MediaNot {
		return MediaNot.isMediaNot(this);
	}

	static isMediaNot(x: unknown): x is MediaNot {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaNot)) {
			return false;
		}

		return x.type === NodeType.MediaNot;
	}
}

export type MediaNotWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaNotWalkerParent = MediaInParensWalkerParent | MediaNot;
