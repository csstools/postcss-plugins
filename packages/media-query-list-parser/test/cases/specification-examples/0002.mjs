import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'print',
	'specification-examples/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
