import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(50px = width)',
	'mf-range/0006',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
