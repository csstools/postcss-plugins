import type { CSSToken} from '@csstools/css-tokenizer';
import { isTokenWhiteSpaceOrComment, stringify } from '@csstools/css-tokenizer';
import type { MediaInParens, MediaInParensWalkerEntry, MediaInParensWalkerParent } from './media-in-parens';
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

	/**
	 * @internal
	 */
	hasLeadingSpace(): boolean {
		if (!this.modifier.length) {
			return this.media.hasLeadingSpace();
		}

		return isTokenWhiteSpaceOrComment(this.modifier[0]);
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

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaNotWalkerEntry, parent: MediaNotWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
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

	/**
	 * @internal
	 */
	toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			modifier: this.modifier,
			media: this.media.toJSON(),
		};
	}

	/**
	 * @internal
	 */
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
