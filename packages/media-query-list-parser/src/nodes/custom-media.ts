import { CSSToken, isTokenIdent, isTokenWhiteSpaceOrComment, stringify, TokenType } from '@csstools/css-tokenizer';
import { NodeType } from '../util/node-type';
import { MediaQuery } from './media-query';

export class CustomMedia {
	type = NodeType.CustomMedia;

	name: Array<CSSToken>;
	mediaQueryList: Array<MediaQuery> | null = null;
	trueOrFalseKeyword: Array<CSSToken> | null = null;

	constructor(name: Array<CSSToken>, mediaQueryList: Array<MediaQuery> | null, trueOrFalseKeyword?: Array<CSSToken>) {
		this.name = name;
		this.mediaQueryList = mediaQueryList;
		this.trueOrFalseKeyword = trueOrFalseKeyword ?? null;
	}

	getName(): string {
		for (let i = 0; i < this.name.length; i++) {
			const token = this.name[i];
			if (isTokenIdent(token)) {
				return token[4].value;
			}
		}

		return '';
	}

	getNameToken(): CSSToken | null {
		for (let i = 0; i < this.name.length; i++) {
			const token = this.name[i];
			if (isTokenIdent(token)) {
				return token;
			}
		}

		return null;
	}

	hasMediaQueryList(): boolean {
		return !!this.mediaQueryList;
	}

	hasTrueKeyword(): boolean {
		if (!this.trueOrFalseKeyword) {
			return false;
		}

		for (let i = 0; i < this.trueOrFalseKeyword.length; i++) {
			const token = this.trueOrFalseKeyword[i];
			if (isTokenWhiteSpaceOrComment(token)) {
				continue;
			}

			if (isTokenIdent(token)) {
				return token[4].value.toLowerCase() === 'true';
			}

			return false;
		}

		return false;
	}

	hasFalseKeyword(): boolean {
		if (!this.trueOrFalseKeyword) {
			return false;
		}

		for (let i = 0; i < this.trueOrFalseKeyword.length; i++) {
			const token = this.trueOrFalseKeyword[i];
			if (isTokenWhiteSpaceOrComment(token)) {
				continue;
			}

			if (isTokenIdent(token)) {
				return token[4].value.toLowerCase() === 'false';
			}

			return false;
		}

		return false;
	}

	tokens(): Array<CSSToken> {
		if (this.trueOrFalseKeyword) {
			return [
				...this.name,
				...this.trueOrFalseKeyword,
			];
		}

		if (!this.mediaQueryList) {
			return [
				...this.name,
			];
		}

		const tokens: Array<CSSToken> = [];
		for (let i = 0; i < this.mediaQueryList.length; i++) {
			const mediaQuery = this.mediaQueryList[i];

			if (i !== 0) {
				tokens.push([TokenType.Comma, ',', -1, -1, undefined]);
			}

			tokens.push(...mediaQuery.tokens());
		}

		return [
			...this.name,
			...tokens,
		];
	}

	toString(): string {
		return stringify(...this.tokens());
	}

	/**
	 * @internal
	 */
	toJSON(): Record<string, unknown> {
		return {
			type: this.type,
			string: this.toString(),
			nameValue: this.getName(),
			name: this.name,
			hasFalseKeyword: this.hasFalseKeyword(),
			hasTrueKeyword: this.hasTrueKeyword(),
			trueOrFalseKeyword: this.trueOrFalseKeyword,
			mediaQueryList: this.mediaQueryList?.map((x) => x.toJSON()),
		};
	}

	/**
	 * @internal
	 */
	isCustomMedia(): this is CustomMedia {
		return CustomMedia.isCustomMedia(this);
	}

	static isCustomMedia(x: unknown): x is CustomMedia {
		if (!x) {
			return false;
		}

		if (!(x instanceof CustomMedia)) {
			return false;
		}

		return x.type === NodeType.CustomMedia;
	}
}
