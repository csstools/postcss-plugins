import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

// MUST all be invalid:
runTest(
	' and and, screen and and (color), only screen print, only only, not print or, and (color), only screen foo (min-width: 300px)',
	'various/0007',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
