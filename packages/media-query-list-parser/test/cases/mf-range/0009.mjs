import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(1000px > height <= 100px)',
	'mf-range/0009',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
