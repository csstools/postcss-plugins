import assert from 'node:assert';
import { cloneTokens, TokenType } from '@csstools/css-tokenizer';

{
	const tokens = [
		[TokenType.Ident, 'foo', 0, 2, { value: 'foo' }],
		[TokenType.Dimension, '3px', 3, 5, { value: 3, unit: 'px', type: 'integer' }],
		[TokenType.EOF, '', -1, -1, undefined],
	];

	const clone = cloneTokens(tokens);

	assert.deepEqual(clone, tokens);
	assert.notStrictEqual(clone, tokens);
	assert.notStrictEqual(clone[0], tokens[0]);
	assert.notStrictEqual(clone[0][4], tokens[0][4]);

	// mutating the clone must not affect the original
	clone[0][1] = 'bar';
	clone[0][4].value = 'bar';

	assert.deepEqual(
		tokens,
		[
			[TokenType.Ident, 'foo', 0, 2, { value: 'foo' }],
			[TokenType.Dimension, '3px', 3, 5, { value: 3, unit: 'px', type: 'integer' }],
			[TokenType.EOF, '', -1, -1, undefined],
		],
	);
}
