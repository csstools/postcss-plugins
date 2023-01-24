import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer,,other-layer',
	'various/0015',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
