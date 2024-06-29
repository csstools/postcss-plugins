import { isTokenDelim, isTokenIdent, TokenDelim } from '@csstools/css-tokenizer';
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

	slice(start: number, end: number): LayerName {
		const indices = [];
		for (let i = 0; i < this.parts.length; i++) {
			if (isTokenIdent(this.parts[i])) {
				indices.push(i);
			}
		}

		const slice = indices.slice(start, end);
		return new LayerName(this.parts.slice(slice[0], slice[slice.length-1]+1));
	}

	concat(other: LayerName): LayerName {
		const dot: TokenDelim = [
			TokenType.Delim,
			'.',
			-1,
			-1,
			{ value: '.' },
		];

		return new LayerName([
			...this.parts.filter((x) => {
				return isTokenIdent(x) || isTokenDelim(x);
			}),
			dot,
			...other.parts.filter((x) => {
				return isTokenIdent(x) || isTokenDelim(x);
			}),
		]);
	}

	segments(): Array<string> {
		return this.parts.filter((x): x is TokenIdent => {
			return isTokenIdent(x);
		}).map((x) => {
			return x[4].value;
		});
	}

	name(): string {
		return this.parts.filter((x): x is TokenIdent | TokenDelim => {
			return isTokenIdent(x) || isTokenDelim(x);
		}).map((x) => {
			return x[1];
		}).join('');
	}

	equal(other: LayerName): boolean {
		const a = this.segments();
		const b = other.segments();
		if (a.length !== b.length) {
			return false;
		}

		for (let i = 0; i < a.length; i++) {
			const aa = a[i];
			const bb = b[i];
			if (aa !== bb) {
				return false;
			}
		}

		return true;
	}

	toString(): string {
		return stringify(...this.parts);
	}

	/**
	 * @internal
	 *
	 * A debug helper to convert the current object to a JSON representation.
	 */
	toJSON(): Record<string, unknown>{
		return {
			parts: this.parts,
			segments: this.segments(),
			name: this.name(),
		};
	}
}
