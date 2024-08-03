import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'l\\61 yer.part',
	'various/0009',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
