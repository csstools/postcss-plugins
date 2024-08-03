import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(calc(10px) )',
	'various/0009',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
