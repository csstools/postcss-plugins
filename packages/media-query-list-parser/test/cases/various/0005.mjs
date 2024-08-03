import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'screen and not (min-width: 300px)',
	'various/0005',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
