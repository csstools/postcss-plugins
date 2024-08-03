import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'/* comment 1 */(/* comment 2 */color/* comment 3 */)/* comment 4 */',
	'mf-boolean/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
