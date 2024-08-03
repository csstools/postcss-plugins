import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer..part',
	'various/0006',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
