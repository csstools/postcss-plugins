import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'only screen and (min-width: 300px) and (min-height: 450px)',
	'query-with-type/0006',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
