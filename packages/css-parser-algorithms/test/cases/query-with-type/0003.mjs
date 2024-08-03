import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'not screen',
	'query-with-type/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
