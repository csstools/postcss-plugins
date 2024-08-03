import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(height > = 100px)',
	'mf-range/0012',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
