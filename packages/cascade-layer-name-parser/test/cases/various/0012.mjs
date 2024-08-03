import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer, sub/layer , sub.layer',
	'various/0012',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
