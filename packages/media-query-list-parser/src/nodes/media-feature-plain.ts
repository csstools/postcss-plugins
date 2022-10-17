import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { stringify, TokenColon } from '@csstools/css-tokenizer';
import { MediaFeatureName } from './media-feature-name';
import { MediaFeatureValue } from './media-feature-value';

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

	walk(cb: (entry: { node: ComponentValue | MediaFeatureValue, parent: ContainerNode | MediaFeaturePlain | MediaFeatureValue }, index: number) => boolean) {
		if (cb({ node: this.value, parent: this }, 0) === false) {
			return false;
		}

		return this.value.walk(cb);
	}
}
