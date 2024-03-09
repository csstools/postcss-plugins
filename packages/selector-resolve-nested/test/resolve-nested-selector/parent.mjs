import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

test('parent', async () => {
	const a = parser().astSync('.a .aa');
	const b = parser().astSync('& + .b');

	const ba = resolveNestedSelector(b, a);

	const firstNode = ba.nodes[0].first;
	assert.equal(firstNode.type, 'pseudo');
	assert.equal(firstNode.parent, ba.nodes[0]);
	assert.equal(firstNode.parent.parent, ba);
});
