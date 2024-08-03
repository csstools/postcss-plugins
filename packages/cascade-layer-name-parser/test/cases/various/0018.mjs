import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'  /* a comment */  abc/* a comment */./* a comment */def  /* a comment */  ,  /* a comment */  ghi/* a comment */./* a comment */jkl/* a comment */./* a comment */mno  ',
	'various/0018',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
