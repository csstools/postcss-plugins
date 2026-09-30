import assert from 'node:assert';
import { test } from 'node:test';
import postcss from 'postcss';
import plugin from '@csstools/postcss-custom-functions';

function doublingCalls(count) {
	let css = '@function --f0() { result: red; }\n';
	for (let i = 1; i <= count; i++) {
		css += `@function --f${i}() { --a: --f${i - 1}(); --b: --f${i - 1}(); result: var(--a); }\n`;
	}

	return css + `.x { color: --f${count}(); }\n`;
}

function doublingDefinitions(count) {
	let css = '@function --f0() { result: red; }\n';
	for (let i = 1; i <= count; i++) {
		css += `@function --f${i}() { result: --f${i - 1}(); }\n`;
		css += `@function --f${i}() { result: --f${i - 1}(); }\n`;
	}

	return css + `.x { color: --f${count}(); }\n`;
}

test('bounded custom function calls compile in bounded time', () => {
	const start = Date.now();
	assert.doesNotThrow(() => {
		postcss([plugin()]).process(doublingCalls(10), { from: undefined }).css;
	});
	assert.ok(Date.now() - start < 5000, 'expected bounded calls to compile quickly');
});

test('exponential custom function call sites throw instead of exhausting resources', () => {
	const start = Date.now();
	assert.throws(() => {
		postcss([plugin()]).process(doublingCalls(40), { from: undefined }).css;
	}, /Maximum custom function expansion size exceeded/);
	assert.ok(Date.now() - start < 5000, 'expected the budget to abort quickly');
});

test('exponential custom function definitions throw instead of exhausting resources', () => {
	assert.throws(() => {
		postcss([plugin()]).process(doublingDefinitions(40), { from: undefined }).css;
	}, /Maximum custom function expansion size exceeded/);
});

test('too many cascade layers warn instead of aborting the build', () => {
	let css = '';
	for (let i = 0; i < 4200; i++) {
		css += `@layer a${i} { .c${i} { color: red; } }\n`;
	}
	css += '@function --f0() { result: red; }\n.x { color: --f0(); }\n';

	const result = postcss([plugin()]).process(css, { from: undefined });

	assert.doesNotThrow(() => result.css);
	assert.ok(result.warnings().some((warning) => /cascade layer/.test(warning.text)));
});
