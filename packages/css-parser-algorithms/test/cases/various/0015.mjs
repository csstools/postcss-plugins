import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'calc(10px, /* a comment */, (other calc(more)))',
	'various/0015',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
