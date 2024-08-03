import assert from 'node:assert';
import { runTestCustomMedia } from '../../util/run-test-custom-media.mjs';

runTestCustomMedia(
	'(max-height: 500px)',
	'custom-media/0010',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
