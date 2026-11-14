import test from 'node:test';
import assert from 'node:assert';
import { parse, parseFromTokens } from '@csstools/custom-function-parser';
import { tokenize } from '@csstools/css-tokenizer';

test('parseFromTokens', async (t) => {
	await t.test('parses tokens', () => {
		const fn = parseFromTokens(tokenize({ css: '--foo(--bar)' }));
		assert.ok(fn);

		assert.strictEqual(fn.getName(), '--foo');
		assert.strictEqual(fn.getReturnType(), '*');
	});

	await t.test('returns false for parser errors', () => {
		const errors = [];
		const options = {
			onParseError: (error) => errors.push(error),
		};

		const fn = parseFromTokens(tokenize({ css: '--foo(--bar' }), options);

		assert.strictEqual(fn, false);
		assert.ok(errors.length > 0);
	});

	await t.test('returns false for grammar errors without reporting parse errors', () => {
		const errors = [];
		const options = {
			onParseError: (error) => errors.push(error),
		};

		const fn = parseFromTokens(tokenize({ css: '--foo(--bar: !)' }), options);

		assert.strictEqual(fn, false);
		assert.strictEqual(errors.length, 0);
	});
});

test('parse', async (t) => {
	await t.test('returns false for an empty prelude', () => {
		assert.strictEqual(parse(''), false);
	});

	await t.test('reports tokenizer errors', () => {
		const errors = [];
		const fn = parse('--foo(--x: "unterminated\n)', {
			onParseError: (error) => errors.push(error),
		});

		assert.strictEqual(fn, false);
		assert.ok(errors.length > 0);
	});
});
