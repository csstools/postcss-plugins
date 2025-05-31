import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo() returns <--bar()>',
	'custom-function/0010',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
