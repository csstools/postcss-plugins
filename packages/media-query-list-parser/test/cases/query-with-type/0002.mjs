import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'only screen',
	'query-with-type/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
