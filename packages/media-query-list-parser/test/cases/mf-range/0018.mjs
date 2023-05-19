import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(width > = 50px)',
	'mf-range/0018',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	0,
);
