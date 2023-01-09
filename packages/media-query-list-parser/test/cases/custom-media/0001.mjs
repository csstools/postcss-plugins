import assert from 'assert';
import { runTestCustomMedia } from '../../util/run-test-custom-media.mjs';

runTestCustomMedia(
	'--foo screen',
	'custom-media/0001',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
