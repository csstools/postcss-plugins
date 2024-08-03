import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'only screen ',
	'various/0006',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
