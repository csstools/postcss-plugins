import { CSSToken, stringify } from '@csstools/css-tokenizer';

export class GeneralEnclosed {
	type = 'general-enclosed';

	raw: Array<CSSToken>;

	constructor(raw: Array<CSSToken>) {
		this.raw = raw;
	}

	toString() {
		return stringify(...this.raw);
	}
}
