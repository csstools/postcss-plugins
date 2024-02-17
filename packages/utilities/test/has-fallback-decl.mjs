import test from 'node:test';
import assert from 'assert';
import { hasFallback } from '@csstools/utilities';
import postcss from 'postcss';

test('hasFallback', async (t) => {
	await t.test('no fallback', () => {
		const source = 'a { color: red; }';
		const root = postcss.parse(source);

		assert.strictEqual(hasFallback(root.first.first), false);
	});

	await t.test('different prop, still no fallback', () => {
		const source = 'a { color: red; colors: red;  }';
		const root = postcss.parse(source);

		assert.strictEqual(hasFallback(root.first.nodes[1]), false);
	});

	await t.test('basic fallback', () => {
		const source = 'a { color: red; color: green;  }';
		const root = postcss.parse(source);

		assert.strictEqual(hasFallback(root.first.nodes[0]), false);
		assert.strictEqual(hasFallback(root.first.nodes[1]), true);
	});

	await t.test('fallback with junk in between', () => {
		const source = 'a { color: red; something-else: 1; color: green;  }';
		const root = postcss.parse(source);

		assert.strictEqual(hasFallback(root.first.nodes[0]), false);
		assert.strictEqual(hasFallback(root.first.nodes[1]), false);
		assert.strictEqual(hasFallback(root.first.nodes[2]), true);
	});
});
