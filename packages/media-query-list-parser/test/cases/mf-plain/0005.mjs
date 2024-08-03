import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'[resolution: infinite]',
	'mf-plain/0005',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
