import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(height >= 100px)',
	'mf-range/0013',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
