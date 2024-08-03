import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(1000px > height < 100px)',
	'mf-range/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
