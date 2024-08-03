import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer, calc(not-a-layer), sub.layer',
	'various/0011',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
