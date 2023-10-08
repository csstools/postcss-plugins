import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(resolution < 1dpi) and (2dpi <= resolution) ',
	'various/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
