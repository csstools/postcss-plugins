import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo(--x <color>: red, --y, --z <length>) returns <string>',
	'custom-function/0014',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
