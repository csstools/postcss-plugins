import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'((color) and (width))',
	'specification-examples/0019',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
