import { comparisonToString, MediaFeatureComparison, MediaFeatureGT, MediaFeatureLT } from './media-feature-comparison';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeatureValue } from './media-feature-value';

export type MediaFeatureRange = MediaFeatureRangeNameValue |
	MediaFeatureRangeValueName |
	MediaFeatureRangeLowHigh |
	MediaFeatureRangeHighLow;

export class MediaFeatureRangeNameValue {
	type = 'mf-range-name-value';

	name: MediaFeatureName;
	operator: MediaFeatureComparison;
	value: MediaFeatureValue;

	constructor(name: MediaFeatureName, operator: MediaFeatureComparison, value: MediaFeatureValue) {
		this.name = name;
		this.operator = operator;
		this.value = value;
	}

	toString() {
		let result = '';

		result += this.name.toString();
		result += ' ';

		result += comparisonToString(this.operator);

		result += ' ';
		result += this.value.toString();

		return result;
	}
}

export class MediaFeatureRangeValueName {
	type = 'mf-range-value-range';

	name: MediaFeatureName;
	operator: MediaFeatureComparison;
	value: MediaFeatureValue;

	constructor(value: MediaFeatureValue, operator: MediaFeatureComparison, name: MediaFeatureName) {
		this.name = name;
		this.operator = operator;
		this.value = value;
	}

	toString() {
		let result = '';

		result += this.value.toString();
		result += ' ';

		result += comparisonToString(this.operator);

		result += ' ';
		result += this.name.toString();

		return result;
	}
}

export class MediaFeatureRangeLowHigh {
	type = 'mf-range-low-high';

	name: MediaFeatureName;
	low: MediaFeatureValue;
	lowOperator: MediaFeatureLT;
	high: MediaFeatureValue;
	highOperator: MediaFeatureLT;

	constructor(name: MediaFeatureName, low: MediaFeatureValue, lowOperator: MediaFeatureLT, high: MediaFeatureValue, highOperator: MediaFeatureLT) {
		this.name = name;
		this.low = low;
		this.lowOperator = lowOperator;
		this.high = high;
		this.highOperator = highOperator;
	}

	toString() {
		let result = '';

		result += this.low.toString();

		result += ' ';
		result += comparisonToString(this.lowOperator);
		result += ' ';

		result += this.name.toString();

		result += ' ';
		result += comparisonToString(this.highOperator);
		result += ' ';

		result += this.high.toString();
		return result;
	}
}

export class MediaFeatureRangeHighLow {
	type = 'mf-range-high-low';

	name: MediaFeatureName;
	low: MediaFeatureValue;
	lowOperator: MediaFeatureGT;
	high: MediaFeatureValue;
	highOperator: MediaFeatureGT;

	constructor(name: MediaFeatureName, high: MediaFeatureValue, highOperator: MediaFeatureGT, low: MediaFeatureValue, lowOperator: MediaFeatureGT) {
		this.name = name;
		this.low = low;
		this.lowOperator = lowOperator;
		this.high = high;
		this.highOperator = highOperator;
	}

	toString() {
		let result = '';

		result += this.high.toString();

		result += ' ';
		result += comparisonToString(this.highOperator);
		result += ' ';

		result += this.name.toString();

		result += ' ';
		result += comparisonToString(this.lowOperator);
		result += ' ';

		result += this.low.toString();
		return result;
	}
}
