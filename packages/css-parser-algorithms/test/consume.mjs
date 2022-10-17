import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from './util/collect-tokens.mjs';
import { consumeFunction, consumeSimpleBlock } from '@csstools/css-parser-algorithms';

{
	const testCases = [
		{
			css: '[10px]',
			advance: 3,
		},
		{
			css: '(calc(10px))',
			advance: 5,
		},
		{
			css: '(calc(10px) )',
			advance: 6,
		},
		{
			css: '(calc(10px)/* a comment */)',
			advance: 6,
		},
		{
			css: '((calc(10px)/* a comment */) (other))',
			advance: 12,
		},
	];

	for (const testCase of testCases) {
		const t = tokenizer({
			css: testCase.css,
		}, { commentsAreTokens: true });

		const tokens = collectTokens(t);
		const ctx = {
			onParseError: ((err) => {
				throw new Error(JSON.stringify(err));
			}),
		};

		const result = consumeSimpleBlock(ctx, tokens);

		assert.deepEqual(
			result.advance,
			testCase.advance,
		);

		assert.deepEqual(
			tokens[result.advance][0],
			TokenType.EOF,
		);

		assert.deepEqual(
			result.node.toString(),
			testCase.css,
		);

		assert.deepEqual(
			result.node.tokens(),
			tokens.slice(0, -1),
		);
	}
}

{
	const testCases = [
		{
			css: 'calc(10px)',
			advance: 3,
		},
		{
			css: 'calc(10px )',
			advance: 4,
		},
		{
			css: 'calc(10px/* a comment */)',
			advance: 4,
		},
		{
			css: 'calc(10px, /* a comment */, (other calc(more)))',
			advance: 15,
		},
	];

	for (const testCase of testCases) {
		const t = tokenizer({
			css: testCase.css,
		}, { commentsAreTokens: true });

		const tokens = collectTokens(t);

		const ctx = {
			onParseError: ((err) => {
				throw new Error(JSON.stringify(err));
			}),
		};

		const result = consumeFunction(ctx, tokens);

		assert.deepEqual(
			result.advance,
			testCase.advance,
		);

		assert.deepEqual(
			tokens[result.advance][0],
			TokenType.EOF,
		);

		assert.deepEqual(
			result.node.toString(),
			testCase.css,
		);

		assert.deepEqual(
			result.node.tokens(),
			tokens.slice(0, -1),
		);
	}
}
