import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer . part',
	'various/0007',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
