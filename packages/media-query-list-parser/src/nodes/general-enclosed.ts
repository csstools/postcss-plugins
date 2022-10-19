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

	walk(cb: (entry: { node: GeneralEnclosedWalkerEntry, parent: GeneralEnclosedWalkerParent }, index: number | string) => boolean) {
		if (cb({ node: this.value, parent: this }, 'value') === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb);
		}
	}
}

export type GeneralEnclosedWalkerEntry = ComponentValue;
export type GeneralEnclosedWalkerParent = ContainerNode | GeneralEnclosed;
