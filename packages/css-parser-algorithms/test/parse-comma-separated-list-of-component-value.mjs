import { tokenizer } from '@csstools/css-tokenizer';
import assert from 'assert';
import { collectTokens } from './util/collect-tokens.mjs';
import { parseCommaSeparatedListOfComponentValues } from '@csstools/css-parser-algorithms';

{
	const testCases = [
		{
			css: '(10px,12px),(10px)',
			result: [['(10px,12px)'], ['(10px)']],
		},

		{
			css: '(10px,12px),10px 10px',
			result: [['(10px,12px)'], ['10px', ' ', '10px']],
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

		const result = parseCommaSeparatedListOfComponentValues(tokens, options);

		assert.deepEqual(
			result.map((x) => x.map((y) => y.toString())),
			testCase.result,
		);
	}
}
