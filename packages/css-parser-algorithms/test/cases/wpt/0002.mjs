import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

// css/css-syntax/unclosed-constructs.html
runTest(
	'(foo',
	'wpt/0002',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	true,
);
