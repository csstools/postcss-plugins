import { ComponentValue, ContainerNode, FunctionNode, TokenNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenFunction, TokenType } from '@csstools/css-tokenizer';
import { isDimension, isIdent, isNumber } from '../util/component-value-is';

export class MediaFeatureValue {
	type = 'mf-value';

	value: ComponentValue | Array<ComponentValue>;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(value: ComponentValue | Array<ComponentValue>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.value = value;
		this.before = before;
		this.after = after;
	}

	tokens() {
		if (Array.isArray(this.value)) {
			return [
				...this.before,
				...this.value.flatMap((x) => x.tokens()),
				...this.after,
			];
		}

		return [
			...this.before,
			...this.value.tokens(),
			...this.after,
		];
	}

	toString() {
		if (Array.isArray(this.value)) {
			return stringify(...this.before) + this.value.map((x) => x.toString()).join('') + stringify(...this.after);
		}

		return stringify(...this.before) + this.value.toString() + stringify(...this.after);
	}

	indexOf(item: ComponentValue): number | string {
		if (item === this.value) {
			return 'value';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'value') {
			return this.value;
		}
	}

	walk(cb: (entry: { node: MediaFeatureValueWalkerEntry, parent: MediaFeatureValueWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.value, parent: this }, 'value') === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb);
		}
	}
}

export type MediaFeatureValueWalkerEntry = ComponentValue | Array<ComponentValue>;
export type MediaFeatureValueWalkerParent = ContainerNode | MediaFeatureValue;

export function matchesMediaFeatureValue(componentValues: Array<ComponentValue>) {
	let candidateIndexStart = -1;
	let candidateIndexEnd = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === 'whitespace') {
			continue;
		}

		if (componentValue.type === 'comment') {
			continue;
		}

		if (candidateIndexStart !== -1) {
			return -1;
		}

		if (isNumber(componentValue)) {
			const maybeRatio = matchesRatioExactly(componentValues.slice(i));
			if (maybeRatio !== -1) {
				candidateIndexStart = maybeRatio[0];
				candidateIndexEnd = maybeRatio[1];
				i += maybeRatio[1] - maybeRatio[0];
				continue;
			}

			candidateIndexStart = i;
			candidateIndexEnd = i;
			continue;
		}

		if (isDimension(componentValue)) {
			candidateIndexStart = i;
			candidateIndexEnd = i;
			continue;
		}

		if (isIdent(componentValue)) {
			candidateIndexStart = i;
			candidateIndexEnd = i;
			continue;
		}

		return -1;
	}

	return [candidateIndexStart, candidateIndexEnd];
}

export function matchesRatioExactly(componentValues: Array<ComponentValue>) {
	let firstNumber = -1;
	let secondNumber = -1;

	const result = matchesRatio(componentValues);
	if (result === -1) {
		return -1;
	}

	firstNumber = result[0];
	secondNumber = result[1];

	for (let i = secondNumber+1; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === 'whitespace') {
			continue;
		}

		if (componentValue.type === 'comment') {
			continue;
		}

		return -1;
	}

	return [firstNumber, secondNumber];
}

export function matchesRatio(componentValues: Array<ComponentValue>) {
	let firstNumber = -1;
	let delim = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === 'whitespace') {
			continue;
		}

		if (componentValue.type === 'comment') {
			continue;
		}

		if (componentValue.type === 'token') {
			const token = componentValue.value as CSSToken;
			if (token[0] === TokenType.Delim && token[4].value === '/') {
				if (firstNumber === -1) {
					return -1;
				}

				if (delim !== -1) {
					return -1;
				}

				delim = i;
				continue;
			}
		}

		if (isNumber(componentValue)) {
			if (delim !== -1) {
				return [firstNumber, i];
			} else if (firstNumber !== -1) {
				return -1;
			} else {
				firstNumber = i;
				continue;
			}
		}

		return -1;
	}

	return -1;
}

