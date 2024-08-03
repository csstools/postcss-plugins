import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(resolution < infinite) and (infinite <= resolution) ',
	'various/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
