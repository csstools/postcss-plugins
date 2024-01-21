import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveNestedSelector } from '@csstools/selector-resolve-nested';
import parser from 'postcss-selector-parser';

test('source indices', async () => {
	const a = parser().astSync('.a .aa');
	const b = parser().astSync('& + .b');

	const ba = resolveNestedSelector(b, a);
	assert.equal(ba.toString(), ':is(.a .aa) + .b');

	const firstSelector = ba.nodes[0];
	const isPseudo = firstSelector.nodes[0];

	assert.equal(isPseudo.toString(), ':is(.a .aa)');
	assert.deepEqual(
		isPseudo.source,
		{ start: { line: 1, column: 1 }, end: { line: 1, column: 6 } },
	);
});
