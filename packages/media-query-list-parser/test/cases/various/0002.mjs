import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'not screen and (min-width: 300px) and (prefers-color-scheme:/* a comment */dark) and (width < 40vw) and (30px < width < 50rem)',
	'various/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
