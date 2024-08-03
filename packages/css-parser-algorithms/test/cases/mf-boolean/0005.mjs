import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(color())',
	'mf-boolean/0005',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
