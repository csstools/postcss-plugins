import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(min-width: c\\61 lc(10px + 2px))',
	'mf-plain/0007',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
