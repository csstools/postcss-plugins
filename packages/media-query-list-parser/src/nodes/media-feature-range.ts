import { ComponentValue, ComponentValueType, TokenNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenDelim, TokenType } from '@csstools/css-tokenizer';
import { comparisonFromTokens, matchesComparison } from './media-feature-comparison';
import { MediaFeatureName, parseMediaFeatureName } from './media-feature-name';
import { MediaFeatureValue, MediaFeatureValueWalkerEntry, MediaFeatureValueWalkerParent, parseMediaFeatureValue } from './media-feature-value';
import { NodeType } from './node-type';

export type MediaFeatureRange = MediaFeatureRangeNameValue |
	MediaFeatureRangeValueName |
	MediaFeatureRangeValueNameValue;

export class MediaFeatureRangeNameValue {
	type = NodeType.MediaFeatureRangeNameValue;

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

	toJSON() {
		return {
			type: this.type,
			name: this.name.toJSON(),
			value: this.value.toJSON(),
			tokens: this.tokens(),
		};
	}
}

export class MediaFeatureRangeValueName {
	type = NodeType.MediaFeatureRangeValueName;

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

	toJSON() {
		return {
			type: this.type,
			name: this.name.toJSON(),
			value: this.value.toJSON(),
			tokens: this.tokens(),
		};
	}
}

export class MediaFeatureRangeValueNameValue {
	type = NodeType.MediaFeatureRangeValueNameValue;

	name: MediaFeatureName;
	valueOne: MediaFeatureValue;
	valueOneOperator: [TokenDelim, TokenDelim] | [TokenDelim];
	valueTwo: MediaFeatureValue;
	valueTwoOperator: [TokenDelim, TokenDelim] | [TokenDelim];

	constructor(name: MediaFeatureName, valueOne: MediaFeatureValue, valueOneOperator: [TokenDelim, TokenDelim] | [TokenDelim], valueTwo: MediaFeatureValue, valueTwoOperator: [TokenDelim, TokenDelim] | [TokenDelim]) {
		this.name = name;
		this.valueOne = valueOne;
		this.valueOneOperator = valueOneOperator;
		this.valueTwo = valueTwo;
		this.valueTwoOperator = valueTwoOperator;
	}

	valueOneOperatorKind() {
		return comparisonFromTokens(this.valueOneOperator);
	}

	valueTwoOperatorKind() {
		return comparisonFromTokens(this.valueTwoOperator);
	}

	tokens() {
		return [
			...this.valueOne.tokens(),
			...this.valueOneOperator,
			...this.name.tokens(),
			...this.valueTwoOperator,
			...this.valueTwo.tokens(),
		];
	}

	toString() {
		return this.valueOne.toString() + stringify(...this.valueOneOperator) + this.name.toString() + stringify(...this.valueTwoOperator) + this.valueTwo.toString();
	}

	indexOf(item: MediaFeatureName | MediaFeatureValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		if (item === this.valueOne) {
			return 'valueOne';
		}

		if (item === this.valueTwo) {
			return 'valueTwo';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'valueOne') {
			return this.valueOne;
		}

		if (index === 'valueTwo') {
			return this.valueTwo;
		}
	}

	walk(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.valueOne, parent: this }, 'valueOne') === false) {
			return false;
		}

		if ('walk' in this.valueOne) {
			if (this.valueOne.walk(cb) === false) {
				return false;
			}
		}

		if (cb({ node: this.valueTwo, parent: this }, 'valueTwo') === false) {
			return false;
		}

		if ('walk' in this.valueTwo) {
			if (this.valueTwo.walk(cb) === false) {
				return false;
			}
		}
	}

	toJSON() {
		return {
			type: this.type,
			name: this.name.toJSON(),
			valueOne: this.valueOne.toJSON(),
			valueTwo: this.valueTwo.toJSON(),
			tokens: this.tokens(),
		};
	}
}

export type MediaFeatureRangeWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
export type MediaFeatureRangeWalkerParent = MediaFeatureValueWalkerParent | MediaFeatureRange;

export function parseMediaFeatureRange(componentValues: Array<ComponentValue>) {
	let comparisonOne: false | [number, number] = false;
	let comparisonTwo: false | [number, number] = false;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Token) {
			const token = componentValue.value as CSSToken;
			if (token[0] === TokenType.Delim) {
				const comparison = matchesComparison(componentValues.slice(i));
				if (comparison !== false) {
					if (comparisonOne === false) {
						comparisonOne = [
							comparison[0] + i,
							comparison[1] + i,
						];
					} else {
						comparisonTwo = [
							comparison[0] + i,
							comparison[1] + i,
						];
						break;
					}
				}
			}
		}
	}

	if (comparisonOne === false) {
		return false;
	}

	const comparisonTokensOne: [TokenDelim, TokenDelim] | [TokenDelim] = [
		(componentValues[comparisonOne[0]] as TokenNode).value as TokenDelim,
	];
	if (comparisonOne[0] !== comparisonOne[1]) {
		comparisonTokensOne.push(
			(componentValues[comparisonOne[1]] as TokenNode).value as TokenDelim,
		);
	}

	if (comparisonTwo === false) {
		const a = componentValues.slice(0, comparisonOne[0]);
		const b = componentValues.slice(comparisonOne[1] + 1);

		const nameA = parseMediaFeatureName(a);
		const nameB = parseMediaFeatureName(b);

		if (!nameA && !nameB) {
			return false;
		}

		if (
			(nameA && !nameB) ||
			nameA && mediaDescriptors.has(nameA.getName().toLowerCase())
		) {
			const value = parseMediaFeatureValue(b);
			if (!value) {
				return false;
			}

			return new MediaFeatureRangeNameValue(nameA, comparisonTokensOne, value);
		}

		if (
			(!nameA && nameB) ||
			nameB && mediaDescriptors.has(nameB.getName().toLowerCase())
		) {
			const value = parseMediaFeatureValue(a);
			if (!value) {
				return false;
			}

			return new MediaFeatureRangeValueName(nameB, comparisonTokensOne, value);
		}

		return false;
	}

	const comparisonTokensTwo: [TokenDelim, TokenDelim] | [TokenDelim] = [
		(componentValues[comparisonTwo[0]] as TokenNode).value as TokenDelim,
	];
	if (comparisonTwo[0] !== comparisonTwo[1]) {
		comparisonTokensTwo.push(
			(componentValues[comparisonTwo[1]] as TokenNode).value as TokenDelim,
		);
	}

	const a = componentValues.slice(0, comparisonOne[0]);
	const b = componentValues.slice(comparisonOne[1] + 1, comparisonTwo[0]);
	const c = componentValues.slice(comparisonTwo[1] + 1);

	const valueA = parseMediaFeatureValue(a);
	const nameB = parseMediaFeatureName(b);
	const valueC = parseMediaFeatureValue(c);

	if (!valueA || !nameB || !valueC) {
		return false;
	}

	return new MediaFeatureRangeValueNameValue(
		nameB,
		valueA,
		comparisonTokensOne,
		valueC,
		comparisonTokensTwo,
	);
}

export const mediaDescriptors = new Set([
	'any-hover',
	'any-pointer',
	'aspect-ratio',
	'color',
	'color-gamut',
	'color-index',
	'device-aspect-ratio',
	'device-height',
	'device-width',
	'display-mode',
	'dynamic-range',
	'environment-blending',
	'forced-colors',
	'grid',
	'height',
	'horizontal-viewport-segments',
	'hover',
	'inverted-colors',
	'monochrome',
	'nav-controls',
	'orientation',
	'overflow-block',
	'overflow-inline',
	'pointer',
	'prefers-color-scheme',
	'prefers-contrast',
	'prefers-reduced-data',
	'prefers-reduced-motion',
	'prefers-reduced-transparency',
	'resolution',
	'scan',
	'scripting',
	'update',
	'vertical-viewport-segments',
	'video-color-gamut',
	'video-dynamic-range',
	'width',
]);
