import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	` 	 layer, 	 other-layer 	 ,

last-layer

`,
	'various/0016',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
