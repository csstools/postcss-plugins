import { ComponentValue, TokenNode } from '@csstools/css-parser-algorithms';
import { parseMediaFeatureName } from './media-feature-name';
import { NodeType } from '../util/node-type';
import { CSSToken, stringify, TokenIdent } from '@csstools/css-tokenizer';

export class MediaFeatureBoolean {
	type = NodeType.MediaFeatureBoolean;

	name: ComponentValue;
	before: Array<CSSToken>;
	after: Array<CSSToken>;

	constructor(name: ComponentValue, before: Array<CSSToken> = [], after: Array<CSSToken> = []) {
		this.name = name;
		this.before = before;
		this.after = after;
	}

	getName() {
		const token = (((this.name as TokenNode).value as CSSToken) as TokenIdent);
		return token[4].value;
	}

	getNameToken() {
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

	at(index: number | string) {
		if (index === 'name') {
			return this.name;
		}
	}

	toJSON() {
		return {
			type: this.type,
			name: this.getName(),
			tokens: this.tokens(),
		};
	}

	isMediaFeatureBoolean(): this is MediaFeatureBoolean {
		return MediaFeatureBoolean.isMediaFeatureBoolean(this);
	}

	static isMediaFeatureBoolean(x: unknown): x is MediaFeatureBoolean {
		if (!x) {
			return false;
		}

		if (!(x instanceof MediaFeatureBoolean)) {
			return false;
		}

		return x.type === NodeType.MediaFeatureBoolean;
	}
}

export function parseMediaFeatureBoolean(componentValues: Array<ComponentValue>) {
	const mediaFeatureName = parseMediaFeatureName(componentValues);
	if (mediaFeatureName === false) {
		return mediaFeatureName;
	}

	return new MediaFeatureBoolean(mediaFeatureName.name, mediaFeatureName.before, mediaFeatureName.after);
}
