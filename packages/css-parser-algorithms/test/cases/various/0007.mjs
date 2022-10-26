import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'[10px]',
	'various/0007',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
