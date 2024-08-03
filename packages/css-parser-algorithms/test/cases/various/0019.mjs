import assert from 'node:assert';
import { runTest } from '../../util/run-test.mjs';

runTest(
	'( (aa) [ab] {ac} z(ad) ) [ (ba) [bb] {bc} z(bd) ] { (ca) [cb] {cc} z(cd) } z( (da) [db] {dc} z(dd) )',
	'various/0019',
	(actual, expected) => {
		assert.deepStrictEqual(
			actual,
			expected,
		);
	},
);
