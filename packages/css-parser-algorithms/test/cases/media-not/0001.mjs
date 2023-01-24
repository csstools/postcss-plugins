import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'not (color)',
	'media-not/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
