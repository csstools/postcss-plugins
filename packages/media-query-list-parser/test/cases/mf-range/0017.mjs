import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(height > env(safe-area-inset-top))',
	'mf-range/0017',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	0,
);
