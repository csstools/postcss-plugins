import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'((calc(10px)/* a comment */) (other))',
	'various/0011',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
