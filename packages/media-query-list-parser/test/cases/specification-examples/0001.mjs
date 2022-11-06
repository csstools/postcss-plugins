import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'screen',
	'specification-examples/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
