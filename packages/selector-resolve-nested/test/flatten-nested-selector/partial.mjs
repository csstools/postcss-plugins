import assert from 'node:assert/strict';
import test from 'node:test';
import { flattenNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

test('partial', async () => {
	const a = parser().astSync('&:hover');
	const b = parser().astSync('a');

	const ba = flattenNestedSelector(b, a);
	assert.equal(ba.toString(), '&:hover a');
});
