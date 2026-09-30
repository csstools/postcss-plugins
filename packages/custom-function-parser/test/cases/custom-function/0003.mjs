import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'/* a comment */--foo( )/* a comment */',
	'custom-function/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
