import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer-name',
	'various/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
