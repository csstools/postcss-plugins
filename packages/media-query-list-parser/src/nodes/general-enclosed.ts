import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { CSSToken } from '@csstools/css-tokenizer';
import { NodeType } from './node-type';

export class GeneralEnclosed {
	type = NodeType.GeneralEnclosed;

	value: ComponentValue;

	constructor(value: ComponentValue) {
		this.value = value;
	}

	tokens(): Array<CSSToken> {
		return this.value.tokens();
	}

	toString(): string {
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

	walk(cb: (entry: { node: GeneralEnclosedWalkerEntry, parent: GeneralEnclosedWalkerParent }, index: number | string) => boolean | void) {
		if (cb({ node: this.value, parent: this }, 'value') === false) {
			return false;
		}

		if ('walk' in this.value) {
			return this.value.walk(cb);
		}
	}

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}
}

export type GeneralEnclosedWalkerEntry = ComponentValue;
export type GeneralEnclosedWalkerParent = ContainerNode | GeneralEnclosed;
