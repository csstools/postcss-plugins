import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo() /* a comment */ returns /* a comment */ <string> /* a comment */ ',
	'custom-function/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
