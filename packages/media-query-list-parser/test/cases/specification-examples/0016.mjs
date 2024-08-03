import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(color) not (pointer) or (hover)',
	'specification-examples/0016',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
