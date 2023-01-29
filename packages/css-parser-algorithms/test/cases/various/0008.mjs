import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(calc(10px))',
	'various/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
