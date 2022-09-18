export enum TokenType {
	Comment = 'comment',
	Dimension = 'dimension',
	Error = 'error',
	Number = 'number',
	Percentage = 'percentage',
	Whitespace = 'space',
}

export enum NumberType {
	Integer = 'integer',
	Number = 'number',
}

export type TokenComment = Token<TokenType.Comment, never>;
export type TokenDimension = Token<TokenType.Dimension, { value: number, unit: string, type: NumberType }>;
export type TokenError = Token<TokenType.Error, Record<string, unknown>>;
export type TokenNumber = Token<TokenType.Number, { value: number, type: NumberType }>;
export type TokenPercentage = Token<TokenType.Percentage, { value: number }>;
export type TokenWhitespace = Token<TokenType.Whitespace, never>;

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
