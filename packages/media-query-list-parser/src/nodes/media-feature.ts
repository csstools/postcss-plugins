import { SimpleBlockNode, TokenNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenType } from '@csstools/css-tokenizer';
import { MediaFeatureBoolean, parseMediaFeatureBoolean } from './media-feature-boolean';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeaturePlain, MediaFeaturePlainWalkerEntry, MediaFeaturePlainWalkerParent, parseMediaFeaturePlain } from './media-feature-plain';
import { MediaFeatureRange, MediaFeatureRangeWalkerEntry, MediaFeatureRangeWalkerParent, parseMediaFeatureRange } from './media-feature-range';
import { MediaFeatureValue } from './media-feature-value';
import { NodeType } from './node-type';

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

	at(index: number | string) {
		if (index === 'feature') {
			return this.feature;
		}
	}

	walk(cb: (entry: { node: MediaFeatureWalkerEntry, parent: MediaFeatureWalkerParent }, index: number | string) => boolean | void) {
		if (cb({ node: this.feature, parent: this }, 'feature') === false) {
			return false;
		}

		if ('walk' in this.feature) {
			return this.feature.walk(cb);
		}
	}

	toJSON() {
		return {
			type: this.type,
			feature: this.feature.toJSON(),
			before: this.before,
			after: this.after,
		};
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

export function newMediaFeatureBoolean(name: string) {
	return new MediaFeature(
		new MediaFeatureBoolean(
			new TokenNode([TokenType.Ident, name, 0, 0, { value: name }]),
		),
		[
			[TokenType.OpenParen, '(', 0, 0, undefined],
		],
		[
			[TokenType.CloseParen, ')', 0, 0, undefined],
		],
	);
}

export function newMediaFeaturePlain(name: string, ...value: Array<CSSToken>) {
	return new MediaFeature(
		new MediaFeaturePlain(
			new MediaFeatureName(
				new TokenNode([TokenType.Ident, name, 0, 0, { value: name }]),
			),
			[TokenType.Colon, ':', 0, 0, undefined],
			new MediaFeatureValue(
				value.map((x) => new TokenNode(x)),
			),
		),
		[
			[TokenType.OpenParen, '(', 0, 0, undefined],
		],
		[
			[TokenType.CloseParen, ')', 0, 0, undefined],
		],
	);
}
