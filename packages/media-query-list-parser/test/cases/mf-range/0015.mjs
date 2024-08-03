import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(-100px <= width)',
	'mf-range/0015',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
