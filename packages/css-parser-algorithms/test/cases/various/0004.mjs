import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(width < calc(50vw - 3rem))',
	'various/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
