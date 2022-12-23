import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer, (not-a-layer), sub.layer',
	'various/0010',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
