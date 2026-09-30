import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo() <string>',
	'custom-function/0006',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
