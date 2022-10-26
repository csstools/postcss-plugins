import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { NodeType } from './node-type';

export class GeneralEnclosed {
	type = NodeType.GeneralEnclosed;

	value: ComponentValue;

	constructor(value: ComponentValue) {
		this.value = value;
	}

	tokens() {
		return this.value.tokens();
	}

	toString() {
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

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}
}

export type GeneralEnclosedWalkerEntry = ComponentValue;
export type GeneralEnclosedWalkerParent = ContainerNode | GeneralEnclosed;
