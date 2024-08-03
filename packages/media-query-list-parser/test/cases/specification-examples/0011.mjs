import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'not ((color) or (hover))',
	'specification-examples/0011',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
