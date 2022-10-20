import { ComponentValue } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenType } from '@csstools/css-tokenizer';
import { isIdent } from '../util/component-value-is';

export class MediaFeatureName {
	type = 'mf-name';

	name: ComponentValue;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(name: ComponentValue, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.name = name;
		this.before = before;
		this.after = after;
	}

	tokens() {
		return [
			...this.before,
			...this.name.tokens(),
			...this.after,
		];
	}

	toString() {
		return stringify(...this.before) + this.name.toString() + stringify(...this.after);
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

export function matchesMediaFeatureName(componentValues: Array<ComponentValue>) {
	let singleIdentTokenIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === 'whitespace') {
			continue;
		}

		if (componentValue.type === 'comment') {
			continue;
		}

		if (isIdent(componentValue)) {
			if (singleIdentTokenIndex !== -1) {
				return -1;
			}

			singleIdentTokenIndex = i;
			continue;
		}

		return -1;
	}

	return singleIdentTokenIndex;
}
