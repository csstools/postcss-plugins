import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent } from './media-in-parens';
import { NodeType } from '../util/node-type';

export class MediaAnd {
	type = NodeType.MediaAnd;

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

	at(index: number | string) {
		if (index === 'media') {
			return this.media;
		}
	}

	walk(cb: (entry: { node: MediaAndWalkerEntry, parent: MediaAndWalkerParent }, index: number | string) => boolean | void) {
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
}

export type MediaAndWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaAndWalkerParent = MediaInParensWalkerParent | MediaAnd;
