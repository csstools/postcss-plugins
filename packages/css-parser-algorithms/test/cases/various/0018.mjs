import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'10px 15px',
	'various/0018',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
