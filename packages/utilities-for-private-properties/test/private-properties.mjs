import test from 'node:test';
import assert from 'node:assert';
import postcss from 'postcss';
import { generatedName } from '@csstools/generate-idents';
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';

const from = 'a/b.css';

function transpile(css, options) {
	const root = postcss.parse(css, { from });
	const transpiler = createPrivatePropertyTranspiler(options);
	root.append(...transpiler.transpile(root.nodes));

	return root.toString();
}

test('private properties', async (t) => {
	await t.test('renames declarations and references', () => {
		const prefix = generatedName('p', from, '0');

		assert.equal(
			transpile('.a { @private { --size: 2px; } width: var(--size); }'),
			`.a { ${prefix}--size: 2px; width: var(${prefix}--size); }`,
		);
	});

	await t.test('hoists property registrations', () => {
		const prefix = generatedName('p', from, '0');

		assert.equal(
			transpile('.a { @private { @property --size <length>: 1px; } width: var(--size); }'),
			`.a { width: var(${prefix}--size); }\n\n@property ${prefix}--size <length>: 1px`,
		);
	});

	await t.test('keeps counters between calls', () => {
		const root = postcss.parse('.a { @private { --x: 1px; } } .b { @private { --y: 2px; } }', { from });
		const transpiler = createPrivatePropertyTranspiler({ namespace: 'm' });

		transpiler.transpile([root.first]);
		transpiler.transpile([root.last]);

		const output = root.toString();
		assert.ok(output.includes(`${generatedName('m', from, '0')}--x`));
		assert.ok(output.includes(`${generatedName('m', from, '1')}--y`));
	});

	await t.test('returns registrations for each call', () => {
		const root = postcss.parse('.a { @private { @property --x <length>: 1px; } } .b { @private { @property --y <length>: 1px; } }', { from });
		const transpiler = createPrivatePropertyTranspiler({ namespace: 'm' });

		const first = transpiler.transpile([root.first]);
		const second = transpiler.transpile([root.last]);

		assert.equal(first.length, 1);
		assert.equal(second.length, 1);
		assert.ok(first[0].params.startsWith(generatedName('m', from, '0')));
		assert.ok(second[0].params.startsWith(generatedName('m', from, '1')));
	});

	await t.test('rewrites style() and inherit() references', () => {
		const prefix = generatedName('p', from, '0');

		assert.equal(
			transpile('.a { @private { --size: 2px; } width: style(--size: 3px); height: inherit(--size); }'),
			`.a { ${prefix}--size: 2px; width: style(${prefix}--size: 3px); height: inherit(${prefix}--size); }`,
		);
	});

	await t.test('rewrites container preludes', () => {
		const prefix = generatedName('p', from, '0');

		assert.equal(
			transpile('.a { @private { --theme: dark; } @container style(--theme: dark) { color: red; } }'),
			`.a { ${prefix}--theme: dark; @container style(${prefix}--theme: dark) { color: red; } }`,
		);
	});

	await t.test('rewrites nested references from the owning rule', () => {
		const prefix = generatedName('p', from, '0');

		assert.equal(
			transpile('.a { @private { --size: 2px; } .b { width: var(--size); } }'),
			`.a { ${prefix}--size: 2px; .b { width: var(${prefix}--size); } }`,
		);
	});

	await t.test('does not rewrite references outside the owning rule', () => {
		assert.equal(
			transpile('.a { @private { --size: 2px; } } .b { width: var(--size); }'),
			`.a { ${generatedName('p', from, '0')}--size: 2px } .b { width: var(--size); }`,
		);
	});

	await t.test('removes empty conditional ancestors', () => {
		const output = transpile('.a { @media (width > 1px) { @private { color: red; } } }');

		assert.ok(!output.includes('@media'));
		assert.ok(!output.includes('@private'));
	});

	await t.test('preserves empty layer blocks', () => {
		const output = transpile('.a { @layer foo { @private { color: red; } } }');

		assert.ok(output.includes('@layer foo'));
		assert.ok(!output.includes('@private'));
	});

	await t.test('leaves invalid private rules alone', () => {
		const css = '@private { --x: 1px; }';

		assert.equal(transpile(css), css);
	});
});
