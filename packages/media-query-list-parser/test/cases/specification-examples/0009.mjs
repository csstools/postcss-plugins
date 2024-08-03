import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(update: slow) or (hover: none)',
	'specification-examples/0009',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
