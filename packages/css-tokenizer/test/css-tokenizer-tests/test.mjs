import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';
import { testCorpus } from '@rmenke/css-tokenizer-tests';
import { tokenizer } from '@csstools/css-tokenizer';

{
	for (const testCase in testCorpus) {
		const t = tokenizer({
			css: testCorpus[testCase].css,
		}, {commentsAreTokens: true});

		assert.deepEqual(
			collectTokens(t).map((x) => toUniversal(x)).slice(0, -1),
			testCorpus[testCase].tokens,
			`css-tokenizer-tests: ${testCase}`,
		);
	}
}

export function toUniversal(token) {
	return {
		type: token[0],
		raw: token[1],
		startIndex: token[2],
		endIndex: token[3] + 1,
		structured: token[4] ?? null,
	};
}
