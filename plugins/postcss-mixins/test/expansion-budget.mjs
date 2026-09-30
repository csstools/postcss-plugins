import assert from 'node:assert';
import { test } from 'node:test';
import postcss from 'postcss';
import plugin from '@csstools/postcss-mixins';

function doublingMixins(count) {
	let css = '@mixin --m0 { color: red; }\n';
	for (let i = 1; i <= count; i++) {
		css += `@mixin --m${i} { @apply --m${i - 1}; @apply --m${i - 1}; }\n`;
	}

	return css + `.x { @apply --m${count}; }\n`;
}

function duplicatingContents(count) {
	let css = '@mixin --m0 { @contents; }\n';
	for (let i = 1; i <= count; i++) {
		css += `@mixin --m${i} { @apply --m${i - 1} { @contents; @contents; } }\n`;
	}

	return css + `.x { @apply --m${count} { color: red; } }\n`;
}

test('bounded nested mixins compile in bounded time', () => {
	const start = Date.now();
	assert.doesNotThrow(() => {
		postcss([plugin()]).process(doublingMixins(10), { from: undefined }).css;
	});
	assert.ok(Date.now() - start < 5000, 'expected bounded nesting to compile quickly');
});

test('exponential nested mixins throw instead of exhausting resources', () => {
	const start = Date.now();
	assert.throws(() => {
		postcss([plugin()]).process(doublingMixins(40), { from: undefined }).css;
	}, /Maximum mixin expansion size exceeded/);
	assert.ok(Date.now() - start < 5000, 'expected the budget to abort quickly');
});

test('exponential @contents duplication throws instead of exhausting resources', () => {
	assert.throws(() => {
		postcss([plugin()]).process(duplicatingContents(40), { from: undefined }).css;
	}, /Maximum mixin expansion size exceeded/);
});
