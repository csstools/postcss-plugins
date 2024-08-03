import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(min-width: calc(10px + 2px))',
	'mf-plain/0006',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
