const { parseComponentValue } = require('@csstools/css-parser-algorithms');
const { TokenType } = require('@csstools/css-tokenizer');

parseComponentValue([
	[
		TokenType.Ident, 'any', 0, 0, undefined,
	],
	[
		TokenType.EOF, '', 0, 0, undefined,
	],
]);
