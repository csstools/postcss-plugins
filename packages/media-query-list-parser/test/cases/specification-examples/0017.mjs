import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'((color) and (pointer) or (hover))',
	'specification-examples/0017',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
