import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(20px < width <= calc(20px * 5))',
	'mf-range/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
