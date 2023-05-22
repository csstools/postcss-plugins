import { ComponentValue, ComponentValueType } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenColon, TokenType } from '@csstools/css-tokenizer';
import { parseMediaFeatureName, MediaFeatureName } from './media-feature-name';
import { parseMediaFeatureValue, MediaFeatureValue, MediaFeatureValueWalkerEntry, MediaFeatureValueWalkerParent } from './media-feature-value';
import { NodeType } from '../util/node-type';

export class MediaFeaturePlain {
	type = NodeType.MediaFeaturePlain;

	name: MediaFeatureName;
	colon: TokenColon;
	value: MediaFeatureValue;

	constructor(name: MediaFeatureName, colon: TokenColon, value: MediaFeatureValue) {
		this.name = name;
		this.colon = colon;
		this.value = value;
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
			this.colon,
			...this.value.tokens(),
		];
	}

	toString(): string {
		return this.name.toString() + stringify(this.colon) + this.value.toString();
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

	walk<T extends Record<string, unknown>>(cb: (entry: { node: MediaFeaturePlainWalkerEntry, parent: MediaFeaturePlainWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T) {
		let stateClone: T | undefined = undefined;
		if (state) {
			stateClone = {
				...state,
			};
		}

		if (cb({ node: this.value, parent: this, state: stateClone }, 'value') === false) {
			return false;
		}

		return this.value.walk(cb, stateClone);
	}

	toJSON() {
		return {
			type: this.type,
			name: this.name.toJSON(),
			value: this.value.toJSON(),
			tokens: this.tokens(),
		};
	}

	isMediaFeaturePlain(): this is MediaFeaturePlain {
		return MediaFeaturePlain.isMediaFeaturePlain(this);
	}

	static isMediaFeaturePlain(x: unknown): x is MediaFeaturePlain {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeaturePlain)) {
			return false;
		}

		return x.type === NodeType.MediaFeaturePlain;
	}
}

export type MediaFeaturePlainWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
export type MediaFeaturePlainWalkerParent = MediaFeatureValueWalkerParent | MediaFeaturePlain;

export function parseMediaFeaturePlain(componentValues: Array<ComponentValue>): MediaFeaturePlain | false {
	let a: Array<ComponentValue> = [];
	let b: Array<ComponentValue> = [];
	let colon: TokenColon | null = null;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Token) {
			const token = componentValue.value as CSSToken;
			if (token[0] === TokenType.Colon) {
				a = componentValues.slice(0, i);
				b = componentValues.slice(i + 1);
				colon = token;
				break;
			}
		}
	}

	if (!a.length || !b.length || !colon) {
		return false;
	}

	const name = parseMediaFeatureName(a);
	if (name === false) {
		return false;
	}

	const value = parseMediaFeatureValue(b);
	if (value === false) {
		return false;
	}

	return new MediaFeaturePlain(name, colon , value);
}
