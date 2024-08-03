import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'speech and (device-aspect-ratio: 16/9)',
	'specification-examples/0006',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
