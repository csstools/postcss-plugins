import { ComponentValue } from '@csstools/css-parser-algorithms';
import { isToken, stringify } from '@csstools/css-tokenizer';

export class MediaFeatureName {
	type = 'mf-name';

	name: ComponentValue;

	constructor(name: ComponentValue) {
		this.name = name;
	}

	tokens() {
		if (isToken(this.name)) {
			return this.name;
		}

		return this.name.tokens();
	}

	toString() {
		if (isToken(this.name)) {
			return stringify(this.name);
		}

		return this.name.toString();
	}

	indexOf(item: ComponentValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		return -1;
	}

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}
	}
}
