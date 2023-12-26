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

	at(index: number | string): MediaInParens | null {
		if (index === 'media') {
			return this.media;
		}

		return null;
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaAndWalkerEntry, parent: MediaAndWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
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
	toJSON(): unknown {
		return {
			type: this.type,
			modifier: this.modifier,
			media: this.media.toJSON(),
		};
	}

	/**
	 * @internal
	 */
	isMediaAnd(): this is MediaAnd {
		return MediaAnd.isMediaAnd(this);
	}

	static isMediaAnd(x: unknown): x is MediaAnd {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaAnd)) {
			return false;
		}

		return x.type === NodeType.MediaAnd;
	}
}

export type MediaAndWalkerEntry = MediaInParensWalkerEntry | MediaInParens;
export type MediaAndWalkerParent = MediaInParensWalkerParent | MediaAnd;
