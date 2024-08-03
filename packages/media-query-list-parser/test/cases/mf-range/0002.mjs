import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'/* comment 1 */(/* comment 2 */30px/* comment 3 */</* comment 4 */width/* comment 5 */)/* comment 6 */',
	'mf-range/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
