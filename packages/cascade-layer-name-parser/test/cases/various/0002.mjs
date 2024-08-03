import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'layer-name.sub-part',
	'various/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
