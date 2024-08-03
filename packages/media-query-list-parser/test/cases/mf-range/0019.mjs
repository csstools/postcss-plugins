import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(width >/* a comment */= 50px)',
	'mf-range/0019',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
