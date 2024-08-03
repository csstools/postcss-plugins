import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer., other-layer',
	'various/0014',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	false,
);
