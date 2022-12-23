import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'abc.def,ghi.jkl.mno',
	'various/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
