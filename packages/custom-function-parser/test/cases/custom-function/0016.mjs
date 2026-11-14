import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'--foo(--x: 1px, )',
	'custom-function/0016',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
