export enum TokenType {
	Whitespace = 'space',
}

export type TokenWhitespace = Token<TokenType.Whitespace>;

export type Token<T extends TokenType> = [
	// The type of token
	T,
	// The token value
	string,
	// Start position of representation
	number,
	// End position of representation
	number,
]
