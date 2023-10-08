import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(resolution < infinite) and (infinite <= resolution) ',
	'various/0009',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	2,
);
