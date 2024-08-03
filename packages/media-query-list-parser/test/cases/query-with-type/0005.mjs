import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'/* a comment 0 */only/* a comment 1 */screen/* a comment 2 */ /* a comment 3 */and/* a comment 4 */(min-width:/* a comment 5 */300px)',
	'query-with-type/0005',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
