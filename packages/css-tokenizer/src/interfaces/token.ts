export enum TokenType {
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#comment-diagram */
	Comment = 'comment',
	Error = 'error',

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
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-hash-token */
	Hash = 'hash-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
	Number = 'number-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-percentage-token */
	Percentage = 'percentage-token',
	/** https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/#typedef-semicolon-token */
	Semicolon = 'semicolon-token',
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
}

export enum NumberType {
	Integer = 'integer',
	Number = 'number',
}

export enum HashType {
	Unrestricted = 'unrestricted',
	ID = 'id',
}

export type TokenCDC = Token<TokenType.CDC, never>;
export type TokenCDO = Token<TokenType.CDO, never>;
export type TokenColon = Token<TokenType.Colon, never>;
export type TokenComma = Token<TokenType.Comma, never>;
export type TokenComment = Token<TokenType.Comment, never>;
export type TokenDelim = Token<TokenType.Delim, { value: string }>;
export type TokenDimension = Token<TokenType.Dimension, { value: number, unit: string, type: NumberType }>;
export type TokenEOF = Token<TokenType.EOF, never>;
export type TokenError = Token<TokenType.Error, Record<string, unknown>>;
export type TokenHash = Token<TokenType.Hash, { value: string, type: HashType }>;
export type TokenNumber = Token<TokenType.Number, { value: number, type: NumberType }>;
export type TokenPercentage = Token<TokenType.Percentage, { value: number }>;
export type TokenSemicolon = Token<TokenType.Semicolon, never>;
export type TokenWhitespace = Token<TokenType.Whitespace, never>;

export type TokenOpenParen = Token<TokenType.OpenParen, never>;
export type TokenCloseParen = Token<TokenType.CloseParen, never>;
export type TokenOpenSquare = Token<TokenType.OpenSquare, never>;
export type TokenCloseSquare = Token<TokenType.CloseSquare, never>;
export type TokenOpenCurly = Token<TokenType.OpenCurly, never>;
export type TokenCloseCurly = Token<TokenType.CloseCurly, never>;

export type CSSToken = TokenCDC |
	TokenCDO |
	TokenColon |
	TokenComma |
	TokenComment |
	TokenDelim |
	TokenDimension |
	TokenEOF |
	TokenError |
	TokenHash |
	TokenNumber |
	TokenPercentage |
	TokenSemicolon |
	TokenWhitespace |
	TokenOpenParen |
	TokenCloseParen |
	TokenOpenSquare |
	TokenCloseSquare |
	TokenOpenCurly |
	TokenCloseCurly;

export type Token<T extends TokenType, U> = [
	/** The type of token */
	T,
	/** The token value */
	string,
	/** Start position of representation */
	number,
	/** End position of representation */
	number,
	/** Extra data */
	U?,
]
