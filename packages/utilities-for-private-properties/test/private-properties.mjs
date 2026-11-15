import test from 'node:test';
import assert from 'node:assert';
import postcss from 'postcss';
import { generateUniqueDashedIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';

const from = 'a/b.css';
const source = hashFileBasenameAndDir(from);

function transpile(css, options) {
	const root = postcss.parse(css, { from });
	const transpiler = createPrivatePropertyTranspiler(options);
	root.append(...transpiler.transpile(root.nodes));

	return root.toString();
}

test('private properties', async (t) => {
	await t.test('renames declarations and references', () => {
		const prefix = generateUniqueDashedIdent('p', source, '0');

		assert.equal(
			transpile('.a { @private { --size: 2px; } width: var(--size); }'),
			`.a { ${prefix}--size: 2px; width: var(${prefix}--size); }`,
		);
	});

	await t.test('hoists property registrations', () => {
		const prefix = generateUniqueDashedIdent('p', source, '0');

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
		assert.ok(output.includes(`${generateUniqueDashedIdent('m', source, '0')}--x`));
		assert.ok(output.includes(`${generateUniqueDashedIdent('m', source, '1')}--y`));
	});

	await t.test('returns registrations for each call', () => {
		const root = postcss.parse('.a { @private { @property --x <length>: 1px; } } .b { @private { @property --y <length>: 1px; } }', { from });
		const transpiler = createPrivatePropertyTranspiler({ namespace: 'm' });

		const first = transpiler.transpile([root.first]);
		const second = transpiler.transpile([root.last]);

		assert.equal(first.length, 1);
		assert.equal(second.length, 1);
		assert.ok(first[0].params.startsWith(generateUniqueDashedIdent('m', source, '0')));
		assert.ok(second[0].params.startsWith(generateUniqueDashedIdent('m', source, '1')));
	});

	await t.test('rewrites style() and inherit() references', () => {
		const prefix = generateUniqueDashedIdent('p', source, '0');

		assert.equal(
			transpile('.a { @private { --size: 2px; } width: style(--size: 3px); height: inherit(--size); }'),
			`.a { ${prefix}--size: 2px; width: style(${prefix}--size: 3px); height: inherit(${prefix}--size); }`,
		);
	});

	await t.test('rewrites container preludes', () => {
		const prefix = generateUniqueDashedIdent('p', source, '0');

		assert.equal(
			transpile('.a { @private { --theme: dark; } @container style(--theme: dark) { color: red; } }'),
			`.a { ${prefix}--theme: dark; @container style(${prefix}--theme: dark) { color: red; } }`,
		);
	});

	await t.test('rewrites nested references from the owning rule', () => {
		const prefix = generateUniqueDashedIdent('p', source, '0');

		assert.equal(
			transpile('.a { @private { --size: 2px; } .b { width: var(--size); } }'),
			`.a { ${prefix}--size: 2px; .b { width: var(${prefix}--size); } }`,
		);
	});

	await t.test('captures enclosing private names in a nested private rule', () => {
		const outer = generateUniqueDashedIdent('p', source, '0');
		const inner = generateUniqueDashedIdent('p', source, '1');

		assert.equal(
			transpile('.a { @private { --x: red; } & { @private { --y: var(--x, green); } color: var(--y, red); background-color: var(--x, blue); } }'),
			`.a { ${outer}--x: red; & { ${inner}--y: var(${outer}--x, green); color: var(${inner}--y, red); background-color: var(${outer}--x, blue); } }`,
		);
	});

	await t.test('captures enclosing private names in nested private container preludes', () => {
		const outer = generateUniqueDashedIdent('p', source, '0');
		const inner = generateUniqueDashedIdent('p', source, '1');

		assert.equal(
			transpile('.a { @private { --x: red; } & { @private { @container style(--x: blue) { --y: 1px; } } } }'),
			`.a { ${outer}--x: red; & { @container style(${outer}--x: blue) { ${inner}--y: 1px; } } }`,
		);
	});

	await t.test('does not rewrite references outside the owning rule', () => {
		assert.equal(
			transpile('.a { @private { --size: 2px; } } .b { width: var(--size); }'),
			`.a { ${generateUniqueDashedIdent('p', source, '0')}--size: 2px } .b { width: var(--size); }`,
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
