import { ComponentValue, ContainerNode } from '@csstools/css-parser-algorithms';
import { CSSToken } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';

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

	at(index: number | string): ComponentValue | undefined {
		if (index === 'value') {
			return this.value;
		}
	}

	walk<T extends Record<string, unknown>>(cb: (entry: { node: GeneralEnclosedWalkerEntry, parent: GeneralEnclosedWalkerParent, state?: T }, index: number | string) => boolean | void, state?: T): false | undefined {
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

	toJSON() {
		return {
			type: this.type,
			tokens: this.tokens(),
		};
	}

	isGeneralEnclosed(): this is GeneralEnclosed {
		return GeneralEnclosed.isGeneralEnclosed(this);
	}

	static isGeneralEnclosed(x: unknown): x is GeneralEnclosed {
		if (!x) {
			return false;
		}

		if (!(x instanceof GeneralEnclosed)) {
			return false;
		}

		return x.type === NodeType.GeneralEnclosed;
	}
}

type GeneralEnclosedWalkerEntry = ComponentValue;
type GeneralEnclosedWalkerParent = ContainerNode | GeneralEnclosed;
