import { ComponentValue } from '@csstools/css-parser-algorithms';
import { isToken, stringify } from '@csstools/css-tokenizer';

export class MediaFeatureName {
	type = 'mf-name';

	value: ComponentValue;

	constructor(value: ComponentValue) {
		this.value = value;
	}

	tokens() {
		if (isToken(this.value)) {
			return this.value;
		}

		return this.value.tokens();
	}

	toString() {
		if (isToken(this.value)) {
			return stringify(this.value);
		}

		return this.value.toString();
	}
}
