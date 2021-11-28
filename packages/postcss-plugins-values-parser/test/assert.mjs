'use strict';
import assert from 'assert';

export function assertNodeIsEqual(node, expected) {
	assert.deepStrictEqual(node.name, expected.name, 'node.name');
	assert.deepStrictEqual(node.params, expected.params, 'node.params');
	assert.deepStrictEqual(node.type, expected.type, 'node.type');
	assert.deepStrictEqual(node.unit, expected.unit, 'node.unit');

	assert.deepStrictEqual(node.isColor, expected.isColor, 'node.isColor');
	assert.deepStrictEqual(node.isVar, expected.isVar, 'node.isVar');

	assert.deepStrictEqual(!!node.nodes, !!expected.nodes, 'node.nodes');
	if (node.nodes) {
		assert.deepStrictEqual(node.nodes.length, expected.nodes.length, 'node.nodes.length');

		for (let i = 0; i < node.nodes.length; i++) {
			const a = node.nodes[i];
			const b = expected.nodes[i];
			assertNodeIsEqual(a, b);
		}
	}
}
