/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * All possible CSS token types
 */
export enum TokenType {
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#comment-diagram}
	 */
	Comment = 'comment',

	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-at-keyword-token}
	 */
	AtKeyword = 'at-keyword-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-string-token}
	 */
	BadString = 'bad-string-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-url-token}
	 */
	BadURL = 'bad-url-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdc-token}
	 */
	CDC = 'CDC-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdo-token}
	 */
	CDO = 'CDO-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-colon-token}
	 */
	Colon = 'colon-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-comma-token}
	 */
	Comma = 'comma-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-delim-token}
	 */
	Delim = 'delim-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-dimension-token}
	 */
	Dimension = 'dimension-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-eof-token}
	 */
	EOF = 'EOF-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-function-token}
	 */
	Function = 'function-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-hash-token}
	 */
	Hash = 'hash-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-ident-token}
	 */
	Ident = 'ident-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token}
	 */
	Number = 'number-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token}
	 */
	Percentage = 'percentage-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-semicolon-token}
	 */
	Semicolon = 'semicolon-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-string-token}
	 */
	String = 'string-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-url-token}
	 */
	URL = 'url-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-whitespace-token}
	 */
	Whitespace = 'whitespace-token',

	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-paren}
	 */
	OpenParen = '(-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-paren}
	 */
	CloseParen = ')-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-square}
	 */
	OpenSquare = '[-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-square}
	 */
	CloseSquare = ']-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-curly}
	 */
	OpenCurly = '{-token',
	/**
	 * @see {@link https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-curly}
	 */
	CloseCurly = '}-token',

	/**
	 * Only appears in the token stream when the `unicodeRangesAllowed` option is set to true.
	 *
	 * @example
	 * ```js
	 * import { tokenize } from '@csstools/css-tokenizer';
	 *
	 * const tokens = tokenize({
	 * 	css: `U+0025-00FF, U+4??`,
	 * 	unicodeRangesAllowed: true,
	 * });
	 *
	 * console.log(tokens);
	 * ```
	 *
	 * @see {@link https://drafts.csswg.org/css-syntax/#typedef-unicode-range-token}
	 */
	UnicodeRange = 'unicode-range-token',
}

/**
 * The type of number token
 * Either `integer` or `number`
 */
export enum NumberType {
	Integer = 'integer',
	Number = 'number',
}

/**
 * The type of hash token
 */
export enum HashType {
	/**
	 * The hash token did not start with an ident sequence (e.g. `#-2`)
	 */
	Unrestricted = 'unrestricted',
	/**
	 * The hash token started with an ident sequence (e.g. `#foo`)
	 * Only hash tokens with the "id" type are valid ID selectors.
	 */
	ID = 'id',
}

export interface TokenAtKeyword extends Token<TokenType.AtKeyword, {
	/**
	 * The unescaped at-keyword name without the leading `@`.
	 */
	value: string
}> {}
export interface TokenBadString extends Token<TokenType.BadString, undefined> {}
export interface TokenBadURL extends Token<TokenType.BadURL, undefined> {}
export interface TokenCDC extends Token<TokenType.CDC, undefined> {}
export interface TokenCDO extends Token<TokenType.CDO, undefined> {}
export interface TokenColon extends Token<TokenType.Colon, undefined> {}
export interface TokenComma extends Token<TokenType.Comma, undefined> {}
export interface TokenComment extends Token<TokenType.Comment, undefined> {}
export interface TokenDelim extends Token<TokenType.Delim, {
	/**
	 * The delim character.
	 */
	value: string
}> {}
export interface TokenDimension extends Token<TokenType.Dimension, {
	/**
	 * The numeric value.
	 */
	value: number,
	/**
	 * The unescaped unit name.
	 */
	unit: string,
	/**
	 * `integer` or `number`
	 */
	type: NumberType
	/**
	 * The sign character as it appeared in the source.
	 * This is only useful if you need to determine if a value was written as "2px" or "+2px".
	 */
	signCharacter?: '+' | '-',
}> {}
export interface TokenEOF extends Token<TokenType.EOF, undefined> {}
export interface TokenFunction extends Token<TokenType.Function, {
	/**
	 * The unescaped function name without the trailing `(`.
	 */
	value: string
}> {}
export interface TokenHash extends Token<TokenType.Hash, {
	/**
	 * The unescaped hash value without the leading `#`.
	 */
	value: string,
	/**
	 * The hash type.
	 */
	type: HashType
}> {}
export interface TokenIdent extends Token<TokenType.Ident, {
	/**
	 * The unescaped ident value.
	 */
	value: string
}> {}
export interface TokenNumber extends Token<TokenType.Number, {
	/**
	 * The numeric value.
	 */
	value: number,
	/**
	 * `integer` or `number`
	 */
	type: NumberType
	/**
	 * The sign character as it appeared in the source.
	 * This is only useful if you need to determine if a value was written as "2" or "+2".
	 */
	signCharacter?: '+' | '-',
}> {}
export interface TokenPercentage extends Token<TokenType.Percentage, {
	/**
 * The numeric value.
 */
	value: number,
	/**
	 * The sign character as it appeared in the source.
	 * This is only useful if you need to determine if a value was written as "2%" or "+2%".
	 */
	signCharacter?: '+' | '-',
}> {}
export interface TokenSemicolon extends Token<TokenType.Semicolon, undefined> {}
export interface TokenString extends Token<TokenType.String, {
	/**
	 * The unescaped string value without the leading and trailing quotes.
	 */
	value: string
}> {}
export interface TokenURL extends Token<TokenType.URL, {
	/**
	 * The unescaped URL value without the leading `url(` and trailing `)`.
	 */
	value: string
}> {}
export interface TokenWhitespace extends Token<TokenType.Whitespace, undefined> {}

export interface TokenOpenParen extends Token<TokenType.OpenParen, undefined> {}
export interface TokenCloseParen extends Token<TokenType.CloseParen, undefined> {}
export interface TokenOpenSquare extends Token<TokenType.OpenSquare, undefined> {}
export interface TokenCloseSquare extends Token<TokenType.CloseSquare, undefined> {}
export interface TokenOpenCurly extends Token<TokenType.OpenCurly, undefined> {}
export interface TokenCloseCurly extends Token<TokenType.CloseCurly, undefined> {}

export interface TokenUnicodeRange extends Token<TokenType.UnicodeRange, {
	startOfRange: number,
	endOfRange: number
}> {}

/**
 * The union of all possible CSS tokens
 */
export type CSSToken = TokenAtKeyword |
	TokenBadString |
	TokenBadURL |
	TokenCDC |
	TokenCDO |
	TokenColon |
	TokenComma |
	TokenComment |
	TokenDelim |
	TokenDimension |
	TokenEOF |
	TokenFunction |
	TokenHash |
	TokenIdent |
	TokenNumber |
	TokenPercentage |
	TokenSemicolon |
	TokenString |
	TokenURL |
	TokenWhitespace |
	TokenOpenParen |
	TokenCloseParen |
	TokenOpenSquare |
	TokenCloseSquare |
	TokenOpenCurly |
	TokenCloseCurly |
	TokenUnicodeRange;

/**
 * The union of all possible CSS tokens that represent a numeric value
 */
export type NumericToken =
	TokenDimension |
	TokenNumber |
	TokenPercentage;

/**
 * The CSS Token interface
 *
 * @remarks
 * CSS Tokens are fully typed and have a strict structure.
 * This makes it easier to iterate and analyze a token stream.
 *
 * The string representation and the parsed value are stored separately for many token types.
 * It is always assumed that the string representation will be used when stringifying, while the parsed value should be used when analyzing tokens.
 */
export interface Token<T extends TokenType, U> extends Array<T | string | number | U> {
	/**
	 * The type of token
	 */
	0: T,
	/**
	 * The token representation
	 *
	 * @remarks
	 * This field will be used when stringifying the token.
	 * Any stored value is assumed to be valid CSS.
	 *
	 * You should never use this field when analyzing the token when there is a parsed value available.
	 * But you must store mutated values here.
	 */
	1: string,
	/**
	 * Start position of representation
	 */
	2: number,
	/**
	 * End position of representation
	 */
	3: number,
	/**
	 * Extra data
	 *
	 * @remarks
	 * This holds the parsed value of each token.
	 * These values are unescaped, unquoted, converted to numbers, etc.
	 *
	 * You should always use this field when analyzing the token.
	 * But you must not assume that mutating only this field will have any effect.
	 */
	4: U,
}

/**
 * Get the mirror variant type of a given token type
 *
 * @example
 *
 * ```js
 * const input = TokenType.OpenParen;
 * const output = mirrorVariantType(input);
 *
 * console.log(output); // TokenType.CloseParen
 * ```
 */
export function mirrorVariantType(type: TokenType): TokenType | null {
	switch (type) {
		case TokenType.OpenParen:
			return TokenType.CloseParen;
		case TokenType.CloseParen:
			return TokenType.OpenParen;

		case TokenType.OpenCurly:
			return TokenType.CloseCurly;
		case TokenType.CloseCurly:
			return TokenType.OpenCurly;

		case TokenType.OpenSquare:
			return TokenType.CloseSquare;
		case TokenType.CloseSquare:
			return TokenType.OpenSquare;

		default:
			return null;
	}
}

/**
 * Get the mirror variant of a given token
 *
 * @example
 *
 * ```js
 * const input = [TokenType.OpenParen, '(', 0, 1, undefined];
 * const output = mirrorVariant(input);
 *
 * console.log(output); // [TokenType.CloseParen, ')', -1, -1, undefined]
 * ```
 */
export function mirrorVariant(token: CSSToken): CSSToken | null {
	switch (token[0]) {
		case TokenType.OpenParen:
			return [TokenType.CloseParen, ')', -1, -1, undefined];
		case TokenType.CloseParen:
			return [TokenType.OpenParen, '(', -1, -1, undefined];

		case TokenType.OpenCurly:
			return [TokenType.CloseCurly, '}', -1, -1, undefined];
		case TokenType.CloseCurly:
			return [TokenType.OpenCurly, '{', -1, -1, undefined];

		case TokenType.OpenSquare:
			return [TokenType.CloseSquare, ']', -1, -1, undefined];
		case TokenType.CloseSquare:
			return [TokenType.OpenSquare, '[', -1, -1, undefined];

		default:
			return null;
	}
}
