import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(color) and ((pointer) or (hover))',
	'specification-examples/0013',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
