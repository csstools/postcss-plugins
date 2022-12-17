import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer part',
	'various/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
