import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(1/5<aspect-ratio<3/2)',
	'mf-range/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
