import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo(--x type(<color>): {red, blue}, --y) returns type(<string>)',
	'custom-function/0015',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
