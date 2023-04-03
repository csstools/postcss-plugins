import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(color > sin(90deg))',
	'mf-range/0016',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	0,
);
