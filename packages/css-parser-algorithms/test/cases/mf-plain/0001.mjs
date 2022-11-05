import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(min-width: 300px)',
	'mf-plain/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
