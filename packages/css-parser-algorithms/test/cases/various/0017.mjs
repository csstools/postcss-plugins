import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(10px,12px),10px 10px',
	'various/0017',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
