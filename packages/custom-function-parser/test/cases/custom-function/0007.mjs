import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'returns <string> --foo()',
	'custom-function/0007',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
