import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'/* comment 1 */(/* comment 2 */min-width/* comment 3 */:/* comment 4 */300px/* comment 5 */)/* comment 6 */',
	'mf-plain/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
