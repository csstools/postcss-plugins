import { CSSToken, stringify, TokenIdent, TokenType } from '@csstools/css-tokenizer';

export class LayerName {
	parts: Array<CSSToken>;

	constructor(parts: Array<CSSToken>) {
		this.parts = parts;
	}

	tokens(): Array<CSSToken> {
		return [
			...this.parts,
		];
	}

	segments(): Array<string> {
		return this.parts.filter((x) => {
			return x[0] === TokenType.Ident;
		}).map((x: TokenIdent) => {
			return x[4].value;
		});
	}

	name(): string {
		return this.parts.filter((x) => {
			return x[0] === TokenType.Ident || x[0] === TokenType.Delim;
		}).map((x: TokenIdent) => {
			return x[1];
		}).join('');
	}

	toString(): string {
		return stringify(...this.parts);
	}

	toJSON() {
		return {
			parts: this.parts,
			segments: this.segments(),
			name: this.name(),
		};
	}
}
