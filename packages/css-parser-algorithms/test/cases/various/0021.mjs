import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(min-width: 300px',
	'various/0021',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	true,
);
