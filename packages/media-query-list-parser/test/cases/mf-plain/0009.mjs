import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(min-width: env(safe-area-inset-top))',
	'mf-plain/0009',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
