import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

// css/css-syntax/unclosed-constructs.html
runTest(
	'{foo',
	'wpt/0003',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	true,
);
