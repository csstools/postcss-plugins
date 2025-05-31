import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo() returns',
	'custom-function/0005',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
