export enum TokenType {
	Colon = 'colon-token',
	Comma = 'comma-token',
	Comment = 'comment',
	Dimension = 'dimension',
	Error = 'error',
	Number = 'number',
	Percentage = 'percentage',
	Semicolon = 'semicolon-token',
	Whitespace = 'whitespace-token',
	EOF = 'EOF-token',

	OpenParen = '(-token',
	CloseParen = ')-token',
	OpenSquare = '[-token',
	CloseSquare = ']-token',
	OpenCurly = '{-token',
	CloseCurly = '}-token',
}

export enum NumberType {
	Integer = 'integer',
	Number = 'number',
}

export type TokenColon = Token<TokenType.Colon, never>;
export type TokenComma = Token<TokenType.Comma, never>;
export type TokenComment = Token<TokenType.Comment, never>;
export type TokenDimension = Token<TokenType.Dimension, { value: number, unit: string, type: NumberType }>;
export type TokenEOF = Token<TokenType.EOF, never>;
export type TokenError = Token<TokenType.Error, Record<string, unknown>>;
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

export type CSSToken = TokenColon |
	TokenComma |
	TokenComment |
	TokenDimension |
	TokenEOF |
	TokenError |
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
	// The type of token
	T,
	// The token value
	string,
	// Start position of representation
	number,
	// End position of representation
	number,
	// Extra data
	U?,
]
