import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'ab/* a comment */c.def,ghi.jkl.mno',
	'various/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
