import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'',
	'specification-examples/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
