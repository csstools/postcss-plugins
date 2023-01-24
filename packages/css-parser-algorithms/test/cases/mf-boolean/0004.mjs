import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(false)',
	'mf-boolean/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
