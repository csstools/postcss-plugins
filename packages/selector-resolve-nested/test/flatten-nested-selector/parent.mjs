import assert from 'node:assert/strict';
import test from 'node:test';
import { flattenNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

test('parent', async () => {
	const a = parser().astSync('.a .aa');
	const b = parser().astSync(':is(&) + .b');

	const ba = flattenNestedSelector(b, a);

	const firstNode = ba.nodes[0].first;
	assert.equal(firstNode.type, 'pseudo');
	assert.equal(firstNode.parent, ba.nodes[0]);
	assert.equal(firstNode.parent.parent, ba);
});
