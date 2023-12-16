export enum TokenType {
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#comment-diagram */
	Comment = 'comment',

	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-at-keyword-token */
	AtKeyword = 'at-keyword-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-string-token */
	BadString = 'bad-string-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-bad-url-token */
	BadURL = 'bad-url-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdc-token */
	CDC = 'CDC-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-cdo-token */
	CDO = 'CDO-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-colon-token */
	Colon = 'colon-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-comma-token */
	Comma = 'comma-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-delim-token */
	Delim = 'delim-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-dimension-token */
	Dimension = 'dimension-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-eof-token */
	EOF = 'EOF-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-function-token */
	Function = 'function-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-hash-token */
	Hash = 'hash-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-ident-token */
	Ident = 'ident-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
	Number = 'number-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
	Percentage = 'percentage-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-semicolon-token */
	Semicolon = 'semicolon-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-string-token */
	String = 'string-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-url-token */
	URL = 'url-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-whitespace-token */
	Whitespace = 'whitespace-token',

	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-paren */
	OpenParen = '(-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-paren */
	CloseParen = ')-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-square */
	OpenSquare = '[-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-square */
	CloseSquare = ']-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-open-curly */
	OpenCurly = '{-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#tokendef-close-curly */
	CloseCurly = '}-token',

	/** https://drafts.csswg.org/css-syntax/#typedef-unicode-range-token */
	UnicodeRange = 'unicode-range-token',

}

export enum NumberType {
	Integer = 'integer',
	Number = 'number',
}

export enum HashType {
	Unrestricted = 'unrestricted',
	ID = 'id',
}

export type TokenAtKeyword = Token<TokenType.AtKeyword, { value: string }>;
export type TokenBadString = Token<TokenType.BadString, undefined>;
export type TokenBadURL = Token<TokenType.BadURL, undefined>;
export type TokenCDC = Token<TokenType.CDC, undefined>;
export type TokenCDO = Token<TokenType.CDO, undefined>;
export type TokenColon = Token<TokenType.Colon, undefined>;
export type TokenComma = Token<TokenType.Comma, undefined>;
export type TokenComment = Token<TokenType.Comment, undefined>;
export type TokenDelim = Token<TokenType.Delim, { value: string }>;
export type TokenDimension = Token<TokenType.Dimension, { value: number, signCharacter?: '+' | '-', unit: string, type: NumberType }>;
export type TokenEOF = Token<TokenType.EOF, undefined>;
export type TokenFunction = Token<TokenType.Function, { value: string }>;
export type TokenHash = Token<TokenType.Hash, { value: string, type: HashType }>;
export type TokenIdent = Token<TokenType.Ident, { value: string }>;
export type TokenNumber = Token<TokenType.Number, { value: number, signCharacter?: '+' | '-', type: NumberType }>;
export type TokenPercentage = Token<TokenType.Percentage, { value: number, signCharacter?: '+' | '-' }>;
export type TokenSemicolon = Token<TokenType.Semicolon, undefined>;
export type TokenString = Token<TokenType.String, { value: string }>;
export type TokenURL = Token<TokenType.URL, { value: string }>;
export type TokenWhitespace = Token<TokenType.Whitespace, undefined>;

export type TokenOpenParen = Token<TokenType.OpenParen, undefined>;
export type TokenCloseParen = Token<TokenType.CloseParen, undefined>;
export type TokenOpenSquare = Token<TokenType.OpenSquare, undefined>;
export type TokenCloseSquare = Token<TokenType.CloseSquare, undefined>;
export type TokenOpenCurly = Token<TokenType.OpenCurly, undefined>;
export type TokenCloseCurly = Token<TokenType.CloseCurly, undefined>;

export type TokenUnicodeRange = Token<TokenType.UnicodeRange, { startOfRange: number, endOfRange: number }>;

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
 * The CSS Token interface
 *
 * @remarks
 * CSS Tokens are fully typed and have a strict structure.
 * This makes it easier to iterate and analyze a token stream.
 *
 * The string representation and the parsed value are stored separately for many token types.
 * It is always assumed that the string representation will be used when stringifying, while the parsed value should be used when analyzing tokens.
 */
export type Token<T extends TokenType, U> = [
	/**
	 * The type of token
	 */
	T,
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
	string,
	/**
	 * Start position of representation
	 */
	number,
	/**
	 * End position of representation
	 */
	number,
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
	U,
]

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

const tokenTypes = Object.values(TokenType);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isToken(x: any): x is CSSToken {
	if (!Array.isArray(x)) {
		return false;
	}

	if (x.length < 4) {
		return false;
	}

	if (!tokenTypes.includes(x[0])) {
		return false;
	}

	if (typeof x[1] !== 'string') {
		return false;
	}

	if (typeof x[2] !== 'number') {
		return false;
	}

	if (typeof x[3] !== 'number') {
		return false;
	}

	return true;
}
