import assert from 'node:assert/strict';
import test from 'node:test';
import { flattenNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

test('source indices - a', async () => {
	const aNode = Symbol('a');
	const bNode = Symbol('b');

	const a = parser().astSync('.a .aa');
	a.source.node = aNode;
	a.walk((node) => {
		node.source.node = aNode;
	});

	const b = parser().astSync('& + .b');
	b.source.node = bNode;
	b.walk((node) => {
		node.source.node = bNode;
	});

	const ba = flattenNestedSelector(b, a);
	assert.equal(ba.toString(), '.a .aa + .b');

	const firstSelector = ba.nodes[0];
	assert.equal(firstSelector.toString(), '.a .aa + .b');

	assert.equal(
		firstSelector.sourceIndex,
		undefined,
	);

	const classNodeA = firstSelector.nodes[0];

	assert.equal(classNodeA.toString(), '.a');
	assert.deepEqual(
		classNodeA.source,
		{ node: aNode, start: { line: 1, column: 1 }, end: { line: 1, column: 2 } },
	);

	assert.equal(
		classNodeA.sourceIndex,
		0,
	);

	const classNodeB = firstSelector.last;

	assert.equal(classNodeB.toString(), '.b');
	assert.deepEqual(
		classNodeB.source,
		{ node: bNode, start: { line: 1, column: 5 }, end: { line: 1, column: 6 } },
	);

	assert.equal(
		classNodeB.sourceIndex,
		4,
	);
});

test('source indices - b', async () => {

	const a = parser().astSync('.a');
	assert.equal(
		a.nodes[0].sourceIndex,
		undefined,
	);

	const b = parser().astSync('.b,\n .bb');
	assert.equal(
		b.nodes[0].first.sourceIndex,
		0,
	);

	assert.equal(
		b.nodes[1].first.sourceIndex,
		5,
	);

	const ba = flattenNestedSelector(b, a);
	assert.equal(ba.toString(), '.a .b,.a \n .bb');

	assert.equal(
		b.nodes[0].first.sourceIndex,
		0,
	);

	assert.equal(
		b.nodes[1].first.sourceIndex,
		5,
	);

	const firstSelector = ba.nodes[0];
	assert.equal(firstSelector.toString(), '.a .b');

	assert.equal(
		firstSelector.sourceIndex,
		undefined,
	);

	assert.equal(
		firstSelector.first.sourceIndex,
		0,
	);

	const secondSelector = ba.nodes[1];
	assert.equal(secondSelector.toString(), '.a \n .bb');

	assert.equal(
		secondSelector.first.sourceIndex,
		0,
	);
});
