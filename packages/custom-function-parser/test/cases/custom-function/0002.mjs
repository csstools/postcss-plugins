import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	' --foo( ) ',
	'custom-function/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
