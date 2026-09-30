import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo(--x <color> : red ) returns <string>',
	'custom-function/0012',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
