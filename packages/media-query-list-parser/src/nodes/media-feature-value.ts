import { ComponentValue, ComponentValueType, ContainerNode, walkerIndexGenerator } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify } from '@csstools/css-tokenizer';
import { isDimension, isEnvironmentVariable, isIdent, isNumber } from '../util/component-value-is';
import { NodeType } from '../util/node-type';
import { isTokenDelim } from '@csstools/css-tokenizer';

export class MediaFeatureValue {
	type = NodeType.MediaFeatureValue;

	value: ComponentValue | Array<ComponentValue>;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(value: ComponentValue | Array<ComponentValue>, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		if (Array.isArray(value) && value.length === 1) {
			this.value = value[0];
		} else {
			this.value = value;
		}

		this.before = before;
		this.after = after;
	}

	tokens(): Array<CSSToken> {
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

	toString(): string {
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

	at(index: number | string): ComponentValue | Array<ComponentValue> | undefined {
		if (index === 'value') {
			return this.value;
		}

		if (Array.isArray(this.value) && (typeof index === 'number')) {
			if (index < 0) {
				index = this.value.length + index;
			}
			return this.value[index];
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaFeatureValueWalkerEntry, parent: MediaFeatureValueWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
		if (Array.isArray(this.value)) {
			if (this.value.length === 0) {
				return;
			}

			const indexGenerator = walkerIndexGenerator(this.value);

			let index = 0;
			while (index < this.value.length) {
				const child = this.value[index];

				let stateClone: T | undefined = undefined;
				if (state) {
					stateClone = {
						...state,
					};
				}

				if (cb({ node: child, parent: this, state: stateClone }, index) === false) {
					return false;
				}

				if ('walk' in child && this.value.includes(child)) {
					if (child.walk(cb, stateClone) === false) {
						return false;
					}
				}

				index = indexGenerator(this.value, child, index);
				if (index === -1) {
					break;
				}
			}
		} else {
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
	}

	/**
	 * @internal
	 */
	toJSON(): Record<string, unknown> {
		if (Array.isArray(this.value)) {
			return {
				type: this.type,
				value: this.value.map((x) => x.toJSON()),
				tokens: this.tokens(),
			};
		}

		return {
			type: this.type,
			value: this.value.toJSON(),
			tokens: this.tokens(),
		};
	}

	/**
	 * @internal
	 */
	isMediaFeatureValue(): this is MediaFeatureValue {
		return MediaFeatureValue.isMediaFeatureValue(this);
	}

	static isMediaFeatureValue(x: unknown): x is MediaFeatureValue {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeatureValue)) {
			return false;
		}

		return x.type === NodeType.MediaFeatureValue;
	}
}

export type MediaFeatureValueWalkerEntry = ComponentValue;
export type MediaFeatureValueWalkerParent = ContainerNode | MediaFeatureValue;

export function parseMediaFeatureValue(componentValues: Array<ComponentValue>, inRangeContext: boolean = false): MediaFeatureValue | false {
	let candidateIndexStart = -1;
	let candidateIndexEnd = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (candidateIndexStart !== -1) {
			return false;
		}

		if (isNumber(componentValue)) {
			const maybeRatio = matchesRatioExactly(componentValues.slice(i));
			if (maybeRatio !== -1) {
				candidateIndexStart = maybeRatio[0] + i;
				candidateIndexEnd = maybeRatio[1] + i;
				i += maybeRatio[1] - maybeRatio[0];
				continue;
			}

			candidateIndexStart = i;
			candidateIndexEnd = i;
			continue;
		}

		if (isEnvironmentVariable(componentValue)) {
			candidateIndexStart = i;
			candidateIndexEnd = i;
			continue;
		}

		if (isDimension(componentValue)) {
			candidateIndexStart = i;
			candidateIndexEnd = i;
			continue;
		}

		if (!inRangeContext && isIdent(componentValue)) {
			candidateIndexStart = i;
			candidateIndexEnd = i;
			continue;
		}

		return false;
	}

	if (candidateIndexStart === -1) {
		return false;
	}

	return new MediaFeatureValue(
		componentValues.slice(candidateIndexStart, candidateIndexEnd + 1),
		componentValues.slice(0, candidateIndexStart).flatMap((x) => {
			return x.tokens();
		}),
		componentValues.slice(candidateIndexEnd + 1).flatMap((x) => {
			return x.tokens();
		}),
	);
}

export function matchesRatioExactly(componentValues: Array<ComponentValue>): -1 | [number, number] {
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

export function matchesRatio(componentValues: Array<ComponentValue>): -1 | [number, number] {
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
			if (isTokenDelim(token) && token[4].value === '/') {
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

