export enum TokenType {
	Comment = 'comment',
	Dimension = 'dimension',
	Error = 'error',
	Number = 'number',
	Percentage = 'percentage',
	Whitespace = 'space',
}

export type TokenComment = Token<TokenType.Comment, never>;
export type TokenError = Token<TokenType.Error, Record<string, unknown>>;
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
