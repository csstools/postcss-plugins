import { ComponentValue } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenType } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
import { MediaCondition, MediaConditionWalkerEntry, MediaConditionWalkerParent } from './media-condition';
import { MediaInParens } from './media-in-parens';
import { MediaNot } from './media-not';

export type MediaQuery = MediaQueryWithType | MediaQueryWithoutType | MediaQueryInvalid;

export class MediaQueryWithType {
	type = NodeType.MediaQueryWithType;

	modifier: Array<CSSToken>;
	mediaType: Array<CSSToken>;
	and: Array<CSSToken> | undefined = undefined;
	media: MediaCondition | undefined = undefined;

	constructor(modifier: Array<CSSToken>, mediaType: Array<CSSToken>, and?: Array<CSSToken> | undefined, media?: MediaCondition | undefined) {
		this.modifier = modifier;
		this.mediaType = mediaType;

		if (and && media) {
			this.and = and;
			this.media = media;
		}
	}

	getModifier(): string {
		if (!this.modifier.length) {
			return '';
		}

		for (let i = 0; i < this.modifier.length; i++) {
			const token = this.modifier[i];
			if (token[0] === TokenType.Ident) {
				return token[4].value;
			}
		}

		return '';
	}

	negateQuery(): MediaQuery {
		const copy = new MediaQueryWithType([...this.modifier], [...this.mediaType], this.and, this.media);
		if (copy.modifier.length === 0) {
			copy.modifier = [
				[TokenType.Ident, 'not', -1, -1, { value: 'not' }],
				[TokenType.Whitespace, ' ', -1, -1, undefined],
			];

			return copy;
		}

		for (let i = 0; i < copy.modifier.length; i++) {
			const token = copy.modifier[i];
			if (token[0] === TokenType.Ident && token[4].value.toLowerCase() === 'not') {
				copy.modifier.splice(i, 1);
				break;
			}

			if (token[0] === TokenType.Ident && token[4].value.toLowerCase() === 'only') {
				token[1] = 'not';
				token[4].value = 'not';
				break;
			}
		}

		return copy;
	}

	getMediaType(): string {
		if (!this.mediaType.length) {
			return '';
		}

		for (let i = 0; i < this.mediaType.length; i++) {
			const token = this.mediaType[i];
			if (token[0] === TokenType.Ident) {
				return token[4].value;
			}
		}

		return '';
	}

	tokens(): Array<CSSToken> {
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

	toString(): string {
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

	at(index: number | string): MediaCondition | undefined {
		if (index === 'media') {
			return this.media;
		}
	}

	walk(cb: (entry: { node: MediaQueryWithTypeWalkerEntry, parent: MediaQueryWithTypeWalkerParent }, index: number | string) => boolean | void): false | undefined {
		if (!this.media) {
			return;
		}

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

	isMediaQueryWithType(): this is MediaQueryWithType {
		return MediaQueryWithType.isMediaQueryWithType(this);
	}

	static isMediaQueryWithType(x: unknown): x is MediaQueryWithType {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaQueryWithType)) {
			return false;
		}

		return x.type === NodeType.MediaQueryWithType;
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

	negateQuery(): MediaQuery {
		let mediaCondition = this.media;
		if (mediaCondition.media.type === NodeType.MediaNot) {
			return new MediaQueryWithoutType(
				new MediaCondition(
					(mediaCondition.media as MediaNot).media,
				),
			);
		}

		if (mediaCondition.media.type === NodeType.MediaConditionListWithOr) {
			mediaCondition = new MediaCondition(
				new MediaInParens(
					mediaCondition,
					[
						[TokenType.Whitespace, ' ', 0, 0, undefined],
						[TokenType.OpenParen, '(', 0, 0, undefined],
					],
					[
						[TokenType.CloseParen, ')', 0, 0, undefined],
					],
				),
			);
		}

		const query = new MediaQueryWithType(
			[
				[TokenType.Ident, 'not', 0, 0, { value: 'not' }],
				[TokenType.Whitespace, ' ', 0, 0, undefined],
			],
			[
				[TokenType.Ident, 'all', 0, 0, { value: 'all' }],
				[TokenType.Whitespace, ' ', 0, 0, undefined],
			],
			[
				[TokenType.Ident, 'and', 0, 0, { value: 'and' }],
			],
			mediaCondition,
		);

		return query;
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

	at(index: number | string): MediaCondition | undefined {
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

	isMediaQueryWithoutType(): this is MediaQueryWithoutType {
		return MediaQueryWithoutType.isMediaQueryWithoutType(this);
	}

	static isMediaQueryWithoutType(x: unknown): x is MediaQueryWithoutType {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaQueryWithoutType)) {
			return false;
		}

		return x.type === NodeType.MediaQueryWithoutType;
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

	negateQuery(): MediaQuery {
		return new MediaQueryInvalid(this.media);
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

	isMediaQueryInvalid(): this is MediaQueryInvalid {
		return MediaQueryInvalid.isMediaQueryInvalid(this);
	}

	static isMediaQueryInvalid(x: unknown): x is MediaQueryInvalid {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaQueryInvalid)) {
			return false;
		}

		return x.type === NodeType.MediaQueryInvalid;
	}
}

export type MediaQueryInvalidWalkerEntry = ComponentValue;
export type MediaQueryInvalidWalkerParent = ComponentValue | MediaQueryInvalid;
