import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'only screen and (min-width: 300px)',
	'query-with-type/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
