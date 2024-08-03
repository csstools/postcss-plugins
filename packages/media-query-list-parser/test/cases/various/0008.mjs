import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(min-width: 300px',
	'various/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
