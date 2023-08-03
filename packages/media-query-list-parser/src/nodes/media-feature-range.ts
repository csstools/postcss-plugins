import { ComponentValue, ComponentValueType, TokenNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenDelim, TokenType } from '@csstools/css-tokenizer';
import { comparisonFromTokens, matchesComparison, MediaFeatureComparison, MediaFeatureEQ, MediaFeatureGT, MediaFeatureLT } from './media-feature-comparison';
import { MediaFeatureName, parseMediaFeatureName } from './media-feature-name';
import { MediaFeatureValue, MediaFeatureValueWalkerEntry, MediaFeatureValueWalkerParent, parseMediaFeatureValue } from './media-feature-value';
import { NodeType } from '../util/node-type';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';

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

	operatorKind(): MediaFeatureComparison | false {
		return comparisonFromTokens(this.operator);
	}

	getName(): string {
		return this.name.getName();
	}

	getNameToken(): CSSToken {
		return this.name.getNameToken();
	}

	tokens(): Array<CSSToken> {
		return [
			...this.name.tokens(),
			...this.operator,
			...this.value.tokens(),
		];
	}

	toString(): string {
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

	at(index: number | string): MediaFeatureName | MediaFeatureValue | undefined {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'value') {
			return this.value;
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.value, parent: this, state: stateClone }, 'value') === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb, stateClone);
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

	isMediaFeatureRangeNameValue(): this is MediaFeatureRangeNameValue {
		return MediaFeatureRangeNameValue.isMediaFeatureRangeNameValue(this);
	}

	static isMediaFeatureRangeNameValue(x: unknown): x is MediaFeatureRangeNameValue {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeatureRangeNameValue)) {
			return false;
		}

		return x.type === NodeType.MediaFeatureRangeNameValue;
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

	operatorKind(): MediaFeatureComparison | false {
		return comparisonFromTokens(this.operator);
	}

	getName(): string {
		return this.name.getName();
	}

	getNameToken(): CSSToken {
		return this.name.getNameToken();
	}

	tokens(): Array<CSSToken> {
		return [
			...this.value.tokens(),
			...this.operator,
			...this.name.tokens(),
		];
	}

	toString(): string {
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

	at(index: number | string): MediaFeatureName | MediaFeatureValue | undefined {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'value') {
			return this.value;
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T) {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.value, parent: this, state: stateClone }, 'value') === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb, stateClone);
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

	isMediaFeatureRangeValueName(): this is MediaFeatureRangeValueName {
		return MediaFeatureRangeValueName.isMediaFeatureRangeValueName(this);
	}

	static isMediaFeatureRangeValueName(x: unknown): x is MediaFeatureRangeValueName {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeatureRangeValueName)) {
			return false;
		}

		return x.type === NodeType.MediaFeatureRangeValueName;
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

	valueOneOperatorKind(): MediaFeatureComparison | false {
		return comparisonFromTokens(this.valueOneOperator);
	}

	valueTwoOperatorKind(): MediaFeatureComparison | false {
		return comparisonFromTokens(this.valueTwoOperator);
	}

	getName(): string {
		return this.name.getName();
	}

	getNameToken(): CSSToken {
		return this.name.getNameToken();
	}

	tokens(): Array<CSSToken> {
		return [
			...this.valueOne.tokens(),
			...this.valueOneOperator,
			...this.name.tokens(),
			...this.valueTwoOperator,
			...this.valueTwo.tokens(),
		];
	}

	toString(): string {
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

	at(index: number | string): MediaFeatureName | MediaFeatureValue | undefined {
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

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaFeatureRangeWalkerEntry, parent: MediaFeatureRangeWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T) {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.valueOne, parent: this, state: stateClone }, 'valueOne') === false) {
			return false;
		}

		if ('walk' in this.valueOne) {
			if (this.valueOne.walk(cb, stateClone) === false) {
				return false;
			}
		}

		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.valueTwo, parent: this, state: stateClone }, 'valueTwo') === false) {
			return false;
		}

		if ('walk' in this.valueTwo) {
			if (this.valueTwo.walk(cb, stateClone) === false) {
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

	isMediaFeatureRangeValueNameValue(): this is MediaFeatureRangeValueNameValue {
		return MediaFeatureRangeValueNameValue.isMediaFeatureRangeValueNameValue(this);
	}

	static isMediaFeatureRangeValueNameValue(x: unknown): x is MediaFeatureRangeValueNameValue {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeatureRangeValueNameValue)) {
			return false;
		}

		return x.type === NodeType.MediaFeatureRangeValueNameValue;
	}
}

export type MediaFeatureRangeWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
export type MediaFeatureRangeWalkerParent = MediaFeatureValueWalkerParent | MediaFeatureRange;

export function parseMediaFeatureRange(componentValues: Array<ComponentValue>): MediaFeatureRange | false {
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
						i += comparison[1];
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
		if (nameA) {
			const value = parseMediaFeatureValue(b, true);
			if (!value) {
				return false;
			}

			return new MediaFeatureRangeNameValue(nameA, comparisonTokensOne, value);
		}

		const nameB = parseMediaFeatureName(b);
		if (nameB) {
			const value = parseMediaFeatureValue(a, true);
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

	const valueA = parseMediaFeatureValue(a, true);
	const nameB = parseMediaFeatureName(b);
	const valueC = parseMediaFeatureValue(c, true);

	if (!valueA || !nameB || !valueC) {
		return false;
	}

	// https://www.w3.org/TR/mediaqueries-5/#mq-range-context
	// Only certain comparison operators are allowed and only in certain combinations.
	{
		const comparisonOneCheck = comparisonFromTokens(comparisonTokensOne);
		if (
			comparisonOneCheck === false ||
			comparisonOneCheck === MediaFeatureEQ.EQ
		) {
			return false;
		}
		const comparisonTwoCheck = comparisonFromTokens(comparisonTokensTwo);
		if (
			comparisonTwoCheck === false ||
			comparisonTwoCheck === MediaFeatureEQ.EQ
		) {
			return false;
		}

		if (
			(
				comparisonOneCheck === MediaFeatureLT.LT ||
				comparisonOneCheck === MediaFeatureLT.LT_OR_EQ
			)
			&&
			(
				comparisonTwoCheck === MediaFeatureGT.GT ||
				comparisonTwoCheck === MediaFeatureGT.GT_OR_EQ
			)
		) {
			return false;
		}

		if (
			(
				comparisonOneCheck === MediaFeatureGT.GT ||
				comparisonOneCheck === MediaFeatureGT.GT_OR_EQ
			)
			&&
			(
				comparisonTwoCheck === MediaFeatureLT.LT ||
				comparisonTwoCheck === MediaFeatureLT.LT_OR_EQ
			)
		) {
			return false;
		}
	}

	return new MediaFeatureRangeValueNameValue(
		nameB,
		valueA,
		comparisonTokensOne,
		valueC,
		comparisonTokensTwo,
	);
}
