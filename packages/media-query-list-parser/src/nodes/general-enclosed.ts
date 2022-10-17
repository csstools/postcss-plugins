import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { isToken, stringify } from '@csstools/css-tokenizer';

export class GeneralEnclosed {
	type = 'general-enclosed';

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

	walk(cb: (entry: { node: ComponentValue, parent: ContainerNode | GeneralEnclosed }, index: number) => boolean) {
		if (cb({ node: this.value, parent: this }, 0) === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb);
		}
	}
}
