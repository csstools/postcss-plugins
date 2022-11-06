import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'screen and (color), projection and (color)',
	'specification-examples/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
