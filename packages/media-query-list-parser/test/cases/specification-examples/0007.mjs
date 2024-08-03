import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'not (width <= -100px)',
	'specification-examples/0007',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
