import assert from 'node:assert';
import { test } from 'node:test';
import postcss from 'postcss';
import plugin from 'postcss-custom-selectors';

function nestedLayers(depth) {
	return `${'@layer a{'.repeat(depth)}.x{}${'}'.repeat(depth)}`;
}

test('nested cascade layers within the depth limit compile in bounded time', () => {
	const start = Date.now();
	postcss([plugin()]).process(nestedLayers(100), { from: undefined }).css;
	assert.ok(Date.now() - start < 5000, 'expected deep but bounded nesting to compile quickly');
});

test('nested cascade layers beyond the depth limit throw instead of exhausting resources', () => {
	assert.throws(() => {
		postcss([plugin()]).process(nestedLayers(500), { from: undefined }).css;
	}, /Maximum nested @layer depth exceeded/);
});
