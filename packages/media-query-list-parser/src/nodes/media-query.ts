import { ComponentValue } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { MediaCondition, MediaConditionWalkerEntry, MediaConditionWalkerParent } from './media-condition';
import { NodeType } from './node-type';

export type MediaQuery = MediaQueryWithType | MediaQueryWithoutType | MediaQueryInvalid;

export class MediaQueryWithType {
	type = NodeType.MediaQueryWithType;

	modifier: Array<CSSToken>;
	mediaType: Array<CSSToken>;
	and: Array<CSSToken>;
	media: MediaCondition | null = null;

	constructor(modifier: Array<CSSToken>, mediaType: Array<CSSToken>, and?: Array<CSSToken>, media?: MediaCondition | null) {
		this.modifier = modifier;
		this.mediaType = mediaType;

		if (and && media) {
			this.and = and;
			this.media = media;
		}
	}

	tokens() {
		if (this.and && this.media) {
			return [
				...this.modifier,
				...this.mediaType,
				...this.and,
				...this.media.tokens(),
			];
		}

		return [
			...this.modifier,
			...this.mediaType,
		];
	}

	toString() {
		if (this.and && this.media) {
			return stringify(...this.modifier) + stringify(...this.mediaType) + stringify(...this.and) + this.media.toString();
		}

		return stringify(...this.modifier) + stringify(...this.mediaType);
	}

	indexOf(item: MediaCondition): number | string {
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

	walk(cb: (entry: { node: MediaQueryWithTypeWalkerEntry, parent: MediaQueryWithTypeWalkerParent }, index: number | string) => boolean | void) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}

	toJSON() {
		return {
			type: this.type,
			string: this.toString(),
			modifier: this.modifier,
			mediaType: this.mediaType,
			and: this.and,
			media: this.media,
		};
	}
}

export type MediaQueryWithTypeWalkerEntry = MediaConditionWalkerEntry | MediaCondition;
export type MediaQueryWithTypeWalkerParent = MediaConditionWalkerParent | MediaQueryWithType;

export class MediaQueryWithoutType {
	type = NodeType.MediaQueryWithoutType;

	media: MediaCondition;

	constructor(media: MediaCondition) {
		this.media = media;
	}

	tokens(): Array<CSSToken> {
		return this.media.tokens();
	}

	toString(): string {
		return this.media.toString();
	}

	indexOf(item: MediaCondition): number | string {
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

	walk(cb: (entry: { node: MediaQueryWithoutTypeWalkerEntry, parent: MediaQueryWithoutTypeWalkerParent }, index: number | string) => boolean | void) {
		if (cb({ node: this.media, parent: this }, 'media') === false) {
			return false;
		}

		return this.media.walk(cb);
	}

	toJSON() {
		return {
			type: this.type,
			string: this.toString(),
			media: this.media,
		};
	}
}

export type MediaQueryWithoutTypeWalkerEntry = MediaConditionWalkerEntry | MediaCondition;
export type MediaQueryWithoutTypeWalkerParent = MediaConditionWalkerParent | MediaQueryWithoutType;

export class MediaQueryInvalid {
	type = NodeType.MediaQueryInvalid;

	media: Array<ComponentValue>;

	constructor(media: Array<ComponentValue>) {
		this.media = media;
	}

	tokens(): Array<CSSToken> {
		return this.media.flatMap((x) => x.tokens());
	}

	toString(): string {
		return this.media.map((x) => x.toString()).join('');
	}

	walk(cb: (entry: { node: MediaQueryInvalidWalkerEntry, parent: MediaQueryInvalidWalkerParent }, index: number | string) => boolean | void) {
		let aborted = false;

		this.media.forEach((child, index) => {
			if (aborted) {
				return;
			}

			if (cb({ node: child, parent: this }, index) === false) {
				aborted = true;
				return;
			}

			if ('walk' in child) {
				if (child.walk(cb) === false) {
					aborted = true;
					return;
				}
			}
		});

		if (aborted) {
			return false;
		}
	}

	toJSON() {
		return {
			type: this.type,
			string: this.toString(),
			media: this.media,
		};
	}
}

export type MediaQueryInvalidWalkerEntry = ComponentValue;
export type MediaQueryInvalidWalkerParent = ComponentValue | MediaQueryInvalid;
