import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(calc(10px)/* a comment */)',
	'various/0010',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
