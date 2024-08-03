import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(true)',
	'mf-boolean/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
