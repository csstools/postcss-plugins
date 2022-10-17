import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from './util/collect-tokens.mjs';
import { parseComponentValue } from '@csstools/css-parser-algorithms';

{
	const testCases = [
		{
			css: '(calc(10px */* a comment */5))',
		},
	];

	for (const testCase of testCases) {
		const t = tokenizer({
			css: testCase.css,
		}, { commentsAreTokens: true });

		const tokens = collectTokens(t);
		const options = {
			onParseError: ((err) => {
				throw new Error(JSON.stringify(err));
			}),
		};

		const result = parseComponentValue(tokens, options);

		assert.deepEqual(
			result.toString(),
			testCase.css,
		);
	}
}
