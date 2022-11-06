import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(resolution(foo): infinite)',
	'mf-plain/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
