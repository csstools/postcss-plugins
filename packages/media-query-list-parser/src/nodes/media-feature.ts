import { SimpleBlockNode, TokenNode, parseListOfComponentValues } from '@csstools/css-parser-algorithms';
import { CSSToken, mutateIdent, stringify, TokenType } from '@csstools/css-tokenizer';
import { MediaFeatureBoolean, parseMediaFeatureBoolean } from './media-feature-boolean';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeaturePlain, MediaFeaturePlainWalkerEntry, MediaFeaturePlainWalkerParent, parseMediaFeaturePlain } from './media-feature-plain';
import { MediaFeatureRange, MediaFeatureRangeWalkerEntry, MediaFeatureRangeWalkerParent, parseMediaFeatureRange } from './media-feature-range';
import { MediaFeatureValue } from './media-feature-value';
import { NodeType } from '../util/node-type';

export class MediaFeature {
	type = NodeType.MediaFeature;

	feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(feature: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.feature = feature;
		this.before = before;
		this.after = after;
	}

	getName(): string {
		return this.feature.getName();
	}

	getNameToken(): CSSToken {
		return this.feature.getNameToken();
	}

	tokens(): Array<CSSToken> {
		return [
			...this.before,
			...this.feature.tokens(),
			...this.after,
		];
	}

	toString(): string {
		return stringify(...this.before) + this.feature.toString() + stringify(...this.after);
	}

	indexOf(item: MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange): number | string {
		if (item === this.feature) {
			return 'feature';
		}

		return -1;
	}

	at(index: number | string): MediaFeatureBoolean | MediaFeaturePlain | MediaFeatureRange | undefined {
		if (index === 'feature') {
			return this.feature;
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaFeatureWalkerEntry, parent: MediaFeatureWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.feature, parent: this, state: stateClone }, 'feature') === false) {
			return false;
		}

		if ('walk' in this.feature) {
			return this.feature.walk(cb, stateClone);
		}
	}

	/**
	 * @internal
	 */
	toJSON() {
		return {
			type: this.type,
			feature: this.feature.toJSON(),
			before: this.before,
			after: this.after,
		};
	}

	/**
	 * @internal
	 */
	isMediaFeature(): this is MediaFeature {
		return MediaFeature.isMediaFeature(this);
	}

	static isMediaFeature(x: unknown): x is MediaFeature {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeature)) {
			return false;
		}

		return x.type === NodeType.MediaFeature;
	}
}

export type MediaFeatureWalkerEntry = MediaFeaturePlainWalkerEntry | MediaFeatureRangeWalkerEntry | MediaFeaturePlain | MediaFeatureBoolean | MediaFeatureRange;
export type MediaFeatureWalkerParent = MediaFeaturePlainWalkerParent | MediaFeatureRangeWalkerParent | MediaFeature;

export function parseMediaFeature(simpleBlock: SimpleBlockNode, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
	if (simpleBlock.startToken[0] !== TokenType.OpenParen) {
		return false;
	}

	const boolean = parseMediaFeatureBoolean(simpleBlock.value);
	if (boolean !== false) {
		return new MediaFeature(boolean, before, after);
	}

	const plain = parseMediaFeaturePlain(simpleBlock.value);
	if (plain !== false) {
		return new MediaFeature(plain, before, after);
	}

	const range = parseMediaFeatureRange(simpleBlock.value);
	if (range !== false) {
		return new MediaFeature(range, before, after);
	}

	return false;
}

export function newMediaFeatureBoolean(name: string): MediaFeature {
	const nameToken: CSSToken = [TokenType.Ident, '', -1, -1, { value: '' }];
	mutateIdent(nameToken, name);

	return new MediaFeature(
		new MediaFeatureBoolean(
			new MediaFeatureName(new TokenNode(nameToken)),
		),
		[
			[TokenType.OpenParen, '(', -1, -1, undefined],
		],
		[
			[TokenType.CloseParen, ')', -1, -1, undefined],
		],
	);
}

export function newMediaFeaturePlain(name: string, ...value: Array<CSSToken>): MediaFeature {
	const nameToken: CSSToken = [TokenType.Ident, '', -1, -1, { value: '' }];
	mutateIdent(nameToken, name);

	const componentValues = parseListOfComponentValues(value);

	return new MediaFeature(
		new MediaFeaturePlain(
			new MediaFeatureName(
				new TokenNode(nameToken),
			),
			[TokenType.Colon, ':', -1, -1, undefined],
			new MediaFeatureValue(
				componentValues.length === 1 ? componentValues[0] : componentValues,
			),
		),
		[
			[TokenType.OpenParen, '(', -1, -1, undefined],
		],
		[
			[TokenType.CloseParen, ')', -1, -1, undefined],
		],
	);
}
