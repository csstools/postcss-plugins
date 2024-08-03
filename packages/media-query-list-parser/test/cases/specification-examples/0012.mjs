import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(not (color)) and (not (hover))',
	'specification-examples/0012',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
