import assert from 'assert';
import { collectTokens } from '../util/collect-tokens.mjs';
import { testCorpus } from '@rmenke/css-tokenizer-tests';
import { tokenizer } from '@csstools/css-tokenizer';

{
	for (const testCase in testCorpus) {
		const t = tokenizer({
			css: testCorpus[testCase].css,
		});

		assert.deepStrictEqual(
			collectTokens(t).map((x) => toUniversal(x)).slice(0, -1),
			testCorpus[testCase].tokens,
			`css-tokenizer-tests: ${testCase}`,
		);
	}
}

function toUniversal(token) {
	if (token[4] && !token[4].signCharacter) {
		delete token[4].signCharacter;
	}

	return {
		type: token[0],
		raw: token[1],
		startIndex: token[2],
		endIndex: token[3] + 1,
		structured: token[4] ?? null,
	};
}
