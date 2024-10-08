import type { ComponentValue} from '@csstools/css-parser-algorithms';
import { walkerIndexGenerator } from '@csstools/css-parser-algorithms';
import type { CSSToken} from '@csstools/css-tokenizer';
import { isTokenIdent, stringify, TokenType } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
import type { MediaConditionWalkerEntry, MediaConditionWalkerParent } from './media-condition';
import { MediaCondition } from './media-condition';
import { MediaInParens } from './media-in-parens';
import type { MediaNot } from './media-not';

export type MediaQuery = MediaQueryWithType | MediaQueryWithoutType | MediaQueryInvalid;

export class MediaQueryWithType {
	type = NodeType.MediaQueryWithType;

	modifier: Array<CSSToken>;
	mediaType: Array<CSSToken>;
	and: Array<CSSToken> | undefined = undefined;
	media: MediaCondition | undefined = undefined;

	constructor(modifier: Array<CSSToken>, mediaType: Array<CSSToken>, and?: Array<CSSToken>, media?: MediaCondition) {
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
			if (isTokenIdent(token)) {
				return token[4].value;
			}
		}

		return '';
	}

	negateQuery(): Array<MediaQuery> {
		const isNegated = this.getModifier().toLowerCase() === 'not';
		const mediaType = this.getMediaType();

		if (!this.and || !this.media) {
			if (isNegated) {
				return [
					new MediaQueryWithType(
						[],
						[
							[TokenType.Ident, mediaType, -1, -1, { value: mediaType }]
						]
					)
				];
			}

			return [
				new MediaQueryWithType(
					[
						[TokenType.Ident, 'not', -1, -1, { value: 'not' }],
						[TokenType.Whitespace, ' ', -1, -1, undefined],
					],
					[
						[TokenType.Ident, mediaType, -1, -1, { value: mediaType }],
					]
				)
			];
		}

		if (isNegated) {
			return [
				new MediaQueryWithType(
					[],
					[
						[TokenType.Ident, mediaType, -1, -1, { value: mediaType }]
					]
				),
				new MediaQueryWithoutType(
					this.media
				)
			];
		}

		return [
			new MediaQueryWithType(
				[
					[TokenType.Ident, 'not', -1, -1, { value: 'not' }],
					[TokenType.Whitespace, ' ', -1, -1, undefined],
				],
				[
					[TokenType.Ident, mediaType, -1, -1, { value: mediaType }]
				]
			),
			...new MediaQueryWithoutType(
				this.media
			).negateQuery()
		];
	}

	getMediaType(): string {
		if (!this.mediaType.length) {
			return '';
		}

		for (let i = 0; i < this.mediaType.length; i++) {
			const token = this.mediaType[i];
			if (isTokenIdent(token)) {
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

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaQueryWithTypeWalkerEntry, parent: MediaQueryWithTypeWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (!this.media) {
			return;
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
			string: this.toString(),
			modifier: this.modifier,
			mediaType: this.mediaType,
			and: this.and,
			media: this.media,
		};
	}

	/**
	 * @internal
	 */
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

	negateQuery(): Array<MediaQuery> {
		let mediaCondition = this.media;
		if (mediaCondition.media.type === NodeType.MediaNot) {
			return [
				new MediaQueryWithoutType(
					new MediaCondition(
						(mediaCondition.media as MediaNot).media,
					),
				)
			];
		}

		if (
			mediaCondition.media.type === NodeType.MediaConditionListWithOr ||
			mediaCondition.media.type === NodeType.MediaConditionListWithAnd
		) {
			mediaCondition = new MediaCondition(
				new MediaInParens(
					mediaCondition,
					[
						[TokenType.Whitespace, ' ', -1, -1, undefined],
						[TokenType.OpenParen, '(', -1, -1, undefined],
					],
					[
						[TokenType.CloseParen, ')', -1, -1, undefined],
					],
				),
			);
		}

		if (
			'before' in mediaCondition.media
		) {
			if (!mediaCondition.media.hasLeadingSpace()) {
				mediaCondition.media.before.splice(
					0,
					0,
					[TokenType.Whitespace, ' ', -1, -1, undefined],
				);
			}
		}

		const query = new MediaQueryWithType(
			[
				[TokenType.Ident, 'not', -1, -1, { value: 'not' }],
				[TokenType.Whitespace, ' ', -1, -1, undefined],
			],
			[
				[TokenType.Ident, 'all', -1, -1, { value: 'all' }],
				[TokenType.Whitespace, ' ', -1, -1, undefined],
			],
			[
				[TokenType.Ident, 'and', -1, -1, { value: 'and' }],
			],
			mediaCondition,
		);

		return [query];
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

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaQueryWithoutTypeWalkerEntry, parent: MediaQueryWithoutTypeWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
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
			string: this.toString(),
			media: this.media,
		};
	}

	/**
	 * @internal
	 */
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

	negateQuery(): Array<MediaQuery> {
		return [new MediaQueryInvalid(this.media)];
	}

	tokens(): Array<CSSToken> {
		return this.media.flatMap((x) => x.tokens());
	}

	toString(): string {
		return this.media.map((x) => x.toString()).join('');
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaQueryInvalidWalkerEntry, parent: MediaQueryInvalidWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		if (this.media.length === 0) {
			return;
		}

		const indexGenerator = walkerIndexGenerator(this.media);

		let index = 0;
		while (index < this.media.length) {
			const child = this.media[index];

			let stateClone: T | undefined = undefined;
			if (state) {
				stateClone = {
					...state,
				};
			}

			if (cb({ node: child, parent: this, state: stateClone }, index) === false) {
				return false;
			}

			if ('walk' in child && this.media.includes(child)) {
				if (child.walk(cb, stateClone) === false) {
					return false;
				}
			}

			index = indexGenerator(this.media, child, index);
			if (index === -1) {
				break;
			}
		}
	}

	/**
	 * @internal
	 */
	toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			string: this.toString(),
			media: this.media,
		};
	}

	/**
	 * @internal
	 */
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
