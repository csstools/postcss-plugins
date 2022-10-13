import { CSSToken, stringify} from '@csstools/css-tokenizer';

export class MediaFeatureValue {
	type = 'mf-value';

	tokens: Array<CSSToken>;

	constructor(tokens: Array<CSSToken>) {
		this.tokens = tokens;
	}

	toString() {
		return stringify(...this.tokens);
	}
}
