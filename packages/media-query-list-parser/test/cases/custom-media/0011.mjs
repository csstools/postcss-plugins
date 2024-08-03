import assert from 'node:assert';
import { runTestCustomMedia } from '../../util/run-test-custom-media.mjs';

runTestCustomMedia(
	'--foo (max-height: does-not-exist(foo))',
	'custom-media/0011',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	1,
);
