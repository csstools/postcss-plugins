import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from './util/collect-tokens.mjs';
import { parseListOfComponentValues } from '@csstools/css-parser-algorithms';

{
	const testCases = [
		{
			css: '10px 15px',
			result: ['10px', ' ', '15px'],
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

		const result = parseListOfComponentValues(tokens, options);

		assert.deepEqual(
			result.map((x) => x.toString()),
			testCase.result,
		);
	}
}
