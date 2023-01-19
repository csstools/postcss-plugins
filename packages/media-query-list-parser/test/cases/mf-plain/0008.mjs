import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(min-width: token(\'foo\'))',
	'mf-plain/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
