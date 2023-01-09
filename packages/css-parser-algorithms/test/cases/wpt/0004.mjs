import assert from 'assert';
import { runTest } from '../../util/run-test.mjs';

// css/css-syntax/unclosed-constructs.html
runTest(
	'bar(foo',
	'wpt/0004',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
	true,
);
