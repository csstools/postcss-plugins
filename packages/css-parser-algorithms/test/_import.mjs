import { parseComponentValue } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';

parseComponentValue([
	[
		TokenType.Ident, 'any', 0, 0, undefined,
	],
	[
		TokenType.EOF, '', 0, 0, undefined,
	],
]);
