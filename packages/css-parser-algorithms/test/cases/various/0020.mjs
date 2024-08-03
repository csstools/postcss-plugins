import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'a,,c',
	'various/0020',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
