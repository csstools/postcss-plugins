import { CSSToken, stringify, TokenType } from '@csstools/css-tokenizer';

export class MediaFeatureName {
	type = 'mf-name';

	tokens: Array<CSSToken>;

	constructor(tokens: Array<CSSToken>) {
		this.tokens = tokens;
	}

	get nameIndex(): number {
		return this.tokens.findIndex((x) => {
			return x[0] === TokenType.Ident;
		});
	}

	toString() {
		return stringify(...this.tokens);
	}
}
