import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'only screen and not (min-width: 300px)',
	'query-with-type/0007',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
