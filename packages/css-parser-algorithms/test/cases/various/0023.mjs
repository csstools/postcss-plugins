import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'foo,,bar',
	'various/0023',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
