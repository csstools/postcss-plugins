import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(/* a comment */foo  ) something else',
	'various/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
