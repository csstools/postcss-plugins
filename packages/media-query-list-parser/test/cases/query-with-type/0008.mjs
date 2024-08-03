import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'screen and (height) and (0.081px < height < 0.679px)',
	'query-with-type/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
