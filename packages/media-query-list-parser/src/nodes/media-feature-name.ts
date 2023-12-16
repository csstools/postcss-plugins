import { ComponentValue, ComponentValueType, TokenNode } from '@csstools/css-parser-algorithms';
import { CSSToken, stringify, TokenIdent } from '@csstools/css-tokenizer';
import { isIdent } from '../util/component-value-is';
import { NodeType } from '../util/node-type';

export class MediaFeatureName {
	type = NodeType.MediaFeatureName;

	name: ComponentValue;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(name: ComponentValue, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.name = name;
		this.before = before;
		this.after = after;
	}

	getName(): string {
		const token = (((this.name as TokenNode).value as CSSToken) as TokenIdent);
		return token[4].value;
	}

	getNameToken(): CSSToken {
		const token = (((this.name as TokenNode).value as CSSToken) as TokenIdent);
		return token;
	}

	tokens(): Array<CSSToken> {
		return [
			...this.before,
			...this.name.tokens(),
			...this.after,
		];
	}

	toString(): string {
		return stringify(...this.before) + this.name.toString() + stringify(...this.after);
	}

	indexOf(item: ComponentValue): number | string {
		if (item === this.name) {
			return 'name';
		}

		return -1;
	}

	at(index: number | string): ComponentValue | undefined {
		if (index === 'name') {
			return this.name;
		}
	}

	/**
	 * @internal
	 */
	toJSON() {
		return {
			type: this.type,
			name: this.getName(),
			tokens: this.tokens(),
		};
	}

	/**
	 * @internal
	 */
	isMediaFeatureName(): this is MediaFeatureName {
		return MediaFeatureName.isMediaFeatureName(this);
	}

	static isMediaFeatureName(x: unknown): x is MediaFeatureName {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeatureName)) {
			return false;
		}

		return x.type === NodeType.MediaFeatureName;
	}
}

export function parseMediaFeatureName(componentValues: Array<ComponentValue>): MediaFeatureName | false {
	let singleIdentTokenIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Whitespace) {
			continue;
		}

		if (componentValue.type === ComponentValueType.Comment) {
			continue;
		}

		if (isIdent(componentValue)) {
			if (singleIdentTokenIndex !== -1) {
				return false;
			}

			singleIdentTokenIndex = i;
			continue;
		}

		return false;
	}

	if (singleIdentTokenIndex === -1) {
		return false;
	}

	return new MediaFeatureName(
		componentValues[singleIdentTokenIndex],
		componentValues.slice(0, singleIdentTokenIndex).flatMap((x) => {
			return x.tokens();
		}),
		componentValues.slice(singleIdentTokenIndex + 1).flatMap((x) => {
			return x.tokens();
		}),
	);
}
