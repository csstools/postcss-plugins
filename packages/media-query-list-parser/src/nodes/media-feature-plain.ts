import { ComponentValue } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenColon, TokenType } from '@csstools/css-tokenizer';
import { matchesMediaFeatureName, MediaFeatureName } from './media-feature-name';
import { matchesMediaFeatureValue, MediaFeatureValue, MediaFeatureValueWalkerEntry, MediaFeatureValueWalkerParent } from './media-feature-value';

export class MediaFeaturePlain {
	type = 'mf-plain';

	name: MediaFeatureName;
	colon: TokenColon;
	value: MediaFeatureValue;

	constructor(name: MediaFeatureName, colon: TokenColon, value: MediaFeatureValue) {
		this.name = name;
		this.colon = colon;
		this.value = value;
	}

	tokens() {
		return [
			...this.name.tokens(),
			this.colon,
			...this.value.tokens(),
		];
	}

	toString() {
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

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}

		if (index === 'value') {
			return this.value;
		}
	}

	walk(cb: (entry: { node: MediaFeaturePlainWalkerEntry, parent: MediaFeaturePlainWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.value, parent: this }, 'value') === false) {
			return false;
		}

		return this.value.walk(cb);
	}
}

export type MediaFeaturePlainWalkerEntry = MediaFeatureValueWalkerEntry | MediaFeatureValue;
export type MediaFeaturePlainWalkerParent = MediaFeatureValueWalkerParent | MediaFeaturePlain;

export function matchesMediaFeaturePlain(componentValues: Array<ComponentValue>) {
	let a: Array<ComponentValue> = [];
	let b: Array<ComponentValue> = [];

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === 'token') {
			const token = componentValue.value as CSSToken;
			if (token[0] === TokenType.Colon) {
				a = componentValues.slice(0, i);
				b = componentValues.slice(i + 1);
				break;
			}
		}
	}

	if (!a.length || !b.length) {
		return -1;
	}

	const aResult = matchesMediaFeatureName(a);
	if (aResult === -1) {
		return -1;
	}

	const bResult = matchesMediaFeatureValue(b);
	if (bResult === -1) {
		return -1;
	}

	return [aResult, bResult];
}
