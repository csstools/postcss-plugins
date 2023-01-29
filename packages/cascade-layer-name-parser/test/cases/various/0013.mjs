import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer, sub+layer , sub.layer',
	'various/0013',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
