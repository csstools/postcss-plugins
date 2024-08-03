import assert from 'node:assert';
import { runTestCustomMedia } from '../../util/run-test-custom-media.mjs';

runTestCustomMedia(
	'--foo (min-width: 300px)',
	'custom-media/0008',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
