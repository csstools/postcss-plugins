import test from 'node:test';
import assert from 'node:assert';
import { hasSupportsAtRuleAncestor } from '@csstools/utilities';
import postcss from 'postcss';

test('hasSupportsAtRuleAncestor', async (t) => {
	await t.test('no fallback', () => {
		const source = 'a { color: red; }';
		const root = postcss.parse(source);

		assert.strictEqual(hasSupportsAtRuleAncestor(root.first.first), false);
	});

	await t.test('basic guard', () => {
		const source = '@supports (color: green) { a { color: purple; } }';
		const root = postcss.parse(source);

		assert.strictEqual(hasSupportsAtRuleAncestor(root.first, /color\s*:\s*green/i), false);
		assert.strictEqual(hasSupportsAtRuleAncestor(root.first.first, /color\s*:\s*green/i), true);
		assert.strictEqual(hasSupportsAtRuleAncestor(root.first.first.first, /color\s*:\s*green/i), true);
	});

	await t.test('different guard', () => {
		const source = '@supports (display; grid) { a { color: purple; } }';
		const root = postcss.parse(source);

		assert.strictEqual(hasSupportsAtRuleAncestor(root.first, /color\s*:\s*green/i), false);
		assert.strictEqual(hasSupportsAtRuleAncestor(root.first.first, /color\s*:\s*green/i), false);
		assert.strictEqual(hasSupportsAtRuleAncestor(root.first.first.first, /color\s*:\s*green/i), false);
	});

	await t.test('css nesting guard', () => {
		const source = 'a { @supports (color: green) { color: purple; } }';
		const root = postcss.parse(source);

		assert.strictEqual(hasSupportsAtRuleAncestor(root.first, /color\s*:\s*green/i), false);
		assert.strictEqual(hasSupportsAtRuleAncestor(root.first.first, /color\s*:\s*green/i), false);
		assert.strictEqual(hasSupportsAtRuleAncestor(root.first.first.first, /color\s*:\s*green/i), true);
	});
});
