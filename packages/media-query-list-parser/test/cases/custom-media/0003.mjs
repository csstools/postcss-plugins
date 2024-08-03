import assert from 'node:assert';
import { runTestCustomMedia } from '../../util/run-test-custom-media.mjs';

runTestCustomMedia(
	'/* comment : 1 */--foo/* comment : 2 */true/* comment : 3 */',
	'custom-media/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
