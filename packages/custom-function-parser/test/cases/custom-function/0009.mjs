import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo() --bar()',
	'custom-function/0009',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
