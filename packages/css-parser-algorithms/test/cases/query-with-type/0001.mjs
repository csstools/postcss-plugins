import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'screen',
	'query-with-type/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
