import { stringify, TokenDelim } from '@csstools/css-tokenizer';
import { comparisonFromTokens } from './media-feature-comparison';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeatureValue, MediaFeatureValueWalkerEntry, MediaFeatureValueWalkerParent } from './media-feature-value';

export type MediaFeatureRange = MediaFeatureRangeNameValue |
	MediaFeatureRangeValueName |
	MediaFeatureRangeLowHigh |
	MediaFeatureRangeHighLow;

export class MediaFeatureRangeNameValue {
	type = 'mf-range-name-value';

	name: MediaFeatureName;
	operator: [TokenDelim, TokenDelim] | [TokenDelim];
	value: MediaFeatureValue;

	constructor(name: MediaFeatureName, operator: [TokenDelim, TokenDelim] | [TokenDelim], value: MediaFeatureValue) {
		this.name = name;
		this.operator = operator;
		this.value = value;
	}

	operatorKind() {
		return comparisonFromTokens(this.operator);
	}

	tokens() {
		return [
			...this.name.tokens(),
			...this.operator,
			...this.value.tokens(),
		];
	}

	toString() {
		return this.name.toString() + stringify(...this.operator) + this.value.toString();
	}

	indexOf(item: MediaFeatureName | MediaFeatureValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		if (item === this.value) {
			return 'value';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'value') {
			return this.value;
		}
	}

	walk(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.value, parent: this }, 'value') === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb);
		}
	}
}

export class MediaFeatureRangeValueName {
	type = 'mf-range-value-range';

	name: MediaFeatureName;
	operator: [TokenDelim, TokenDelim] | [TokenDelim];
	value: MediaFeatureValue;

	constructor(name: MediaFeatureName, operator: [TokenDelim, TokenDelim] | [TokenDelim], value: MediaFeatureValue) {
		this.name = name;
		this.operator = operator;
		this.value = value;
	}

	operatorKind() {
		return comparisonFromTokens(this.operator);
	}

	tokens() {
		return [
			...this.value.tokens(),
			...this.operator,
			...this.name.tokens(),
		];
	}

	toString() {
		return this.value.toString() + stringify(...this.operator) + this.name.toString();
	}

	indexOf(item: MediaFeatureName | MediaFeatureValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		if (item === this.value) {
			return 'value';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'value') {
			return this.value;
		}
	}

	walk(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.value, parent: this }, 'value') === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb);
		}
	}
}

export class MediaFeatureRangeLowHigh {
	type = 'mf-range-low-high';

	name: MediaFeatureName;
	low: MediaFeatureValue;
	lowOperator: [TokenDelim, TokenDelim] | [TokenDelim];
	high: MediaFeatureValue;
	highOperator: [TokenDelim, TokenDelim] | [TokenDelim];

	constructor(name: MediaFeatureName, low: MediaFeatureValue, lowOperator: [TokenDelim, TokenDelim] | [TokenDelim], high: MediaFeatureValue, highOperator: [TokenDelim, TokenDelim] | [TokenDelim]) {
		this.name = name;
		this.low = low;
		this.lowOperator = lowOperator;
		this.high = high;
		this.highOperator = highOperator;
	}

	lowOperatorKind() {
		return comparisonFromTokens(this.lowOperator);
	}

	highOperatorKind() {
		return comparisonFromTokens(this.highOperator);
	}

	tokens() {
		return [
			...this.low.tokens(),
			...this.lowOperator,
			...this.name.tokens(),
			...this.highOperator,
			...this.high.tokens(),
		];
	}

	toString() {
		return this.low.toString() + stringify(...this.lowOperator) + this.name.toString() + stringify(...this.highOperator) + this.high.toString();
	}

	indexOf(item: MediaFeatureName | MediaFeatureValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		if (item === this.low) {
			return 'low';
		}

		if (item === this.high) {
			return 'high';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'low') {
			return this.low;
		}

		if (index === 'high') {
			return this.high;
		}
	}

	walk(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.low, parent: this }, 'low') === false) {
			return false;
		}

		if ('walk' in this.low) {
			if (this.low.walk(cb) === false) {
				return false;
			}
		}

		if (cb({ node: this.high, parent: this }, 'high') === false) {
			return false;
		}

		if ('walk' in this.high) {
			if (this.high.walk(cb) === false) {
				return false;
			}
		}
	}
}

export class MediaFeatureRangeHighLow {
	type = 'mf-range-high-low';

	name: MediaFeatureName;
	low: MediaFeatureValue;
	lowOperator: [TokenDelim, TokenDelim] | [TokenDelim];
	high: MediaFeatureValue;
	highOperator: [TokenDelim, TokenDelim] | [TokenDelim];

	constructor(name: MediaFeatureName, high: MediaFeatureValue, highOperator: [TokenDelim, TokenDelim] | [TokenDelim], low: MediaFeatureValue, lowOperator: [TokenDelim, TokenDelim] | [TokenDelim]) {
		this.name = name;
		this.low = low;
		this.lowOperator = lowOperator;
		this.high = high;
		this.highOperator = highOperator;
	}

	lowOperatorKind() {
		return comparisonFromTokens(this.lowOperator);
	}

	highOperatorKind() {
		return comparisonFromTokens(this.highOperator);
	}

	tokens() {
		return [
			...this.high.tokens(),
			...this.highOperator,
			...this.name.tokens(),
			...this.lowOperator,
			...this.low.tokens(),
		];
	}

	toString() {
		return this.high.toString() + stringify(...this.highOperator) + this.name.toString() + stringify(...this.lowOperator) + this.low.toString();
	}

	indexOf(item: MediaFeatureName | MediaFeatureValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		if (item === this.low) {
			return 'low';
		}

		if (item === this.high) {
			return 'high';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'low') {
			return this.low;
		}

		if (index === 'high') {
			return this.high;
		}
	}

	walk(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.high, parent: this }, 'high') === false) {
			return false;
		}

		if ('walk' in this.high) {
			if (this.high.walk(cb) === false) {
				return false;
			}
		}

		if (cb({ node: this.low, parent: this }, 'low') === false) {
			return false;
		}

		if ('walk' in this.low) {
			if (this.low.walk(cb) === false) {
				return false;
			}
		}
	}
}

export type MediaFeatureRangeWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
export type MediaFeatureRangeWalkerParent = MediaFeatureValueWalkerParent | MediaFeatureRange;
