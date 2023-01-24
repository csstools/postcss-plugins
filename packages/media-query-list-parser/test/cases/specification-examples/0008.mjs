import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'(width < 600px) and (height < 600px)',
	'specification-examples/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
