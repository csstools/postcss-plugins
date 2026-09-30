import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo(--x <color> ) returns <string>',
	'custom-function/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
