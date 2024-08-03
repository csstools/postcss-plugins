import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'lay\\,er,other-la\\.yer.sub-layer',
	'various/0017',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
