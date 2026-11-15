import test from 'node:test';
import assert from 'node:assert';
import postcss from 'postcss';
import { generateUniqueDashedIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';

const from = 'a/b.css';
const source = hashFileBasenameAndDir(from);

function prefix(increment = '0', namespace = 'p') {
	return generateUniqueDashedIdent(namespace, source, increment);
}

function transpile(css, options) {
	const root = postcss.parse(css, { from });
	const transpiler = createPrivatePropertyTranspiler(options);
	root.append(...transpiler.transpile(root.nodes));

	return root.toString();
}

test('private properties', async (t) => {
	await t.test('renames declarations and references', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --size: 2px; } width: var(--size); }'),
			`.a { ${p}--size: 2px; width: var(${p}--size); }`,
		);
	});

	await t.test('keeps important declarations', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --size: 2px !important; } width: var(--size); }'),
			`.a { ${p}--size: 2px !important; width: var(${p}--size); }`,
		);
	});

	await t.test('keeps counters between calls', () => {
		const root = postcss.parse('.a { @private { --x: 1px; } } .b { @private { --y: 2px; } }', { from });
		const transpiler = createPrivatePropertyTranspiler({ namespace: 'm' });

		transpiler.transpile([root.first]);
		transpiler.transpile([root.last]);

		const output = root.toString();
		assert.ok(output.includes(`${prefix('0', 'm')}--x`));
		assert.ok(output.includes(`${prefix('1', 'm')}--y`));
	});

	await t.test('uses the namespace for generated names', () => {
		assert.equal(
			transpile('.a { @private { --x: 1px; } }', { namespace: 'm' }),
			`.a { ${prefix('0', 'm')}--x: 1px }`,
		);
	});

	await t.test('rewrites style() and inherit() references', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --size: 2px; } width: style(--size: 3px); height: inherit(--size); }'),
			`.a { ${p}--size: 2px; width: style(${p}--size: 3px); height: inherit(${p}--size); }`,
		);
	});

	await t.test('rewrites style() references inside if()', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --size: 2px; } width: if(style(--size: 3px): 1px; else: 2px); }'),
			`.a { ${p}--size: 2px; width: if(style(${p}--size: 3px): 1px; else: 2px); }`,
		);
	});

	await t.test('rewrites container preludes', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --theme: dark; } @container style(--theme: dark) { color: red; } }'),
			`.a { ${p}--theme: dark; @container style(${p}--theme: dark) { color: red; } }`,
		);
	});

	await t.test('rewrites nested references from the owning rule', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --size: 2px; } .b { width: var(--size); } }'),
			`.a { ${p}--size: 2px; .b { width: var(${p}--size); } }`,
		);
	});

	await t.test('captures enclosing private names in a nested private rule', () => {
		const outer = prefix('0');
		const inner = prefix('1');

		assert.equal(
			transpile('.a { @private { --x: red; } & { @private { --y: var(--x, green); } color: var(--y, red); background-color: var(--x, blue); } }'),
			`.a { ${outer}--x: red; & { ${inner}--y: var(${outer}--x, green); color: var(${inner}--y, red); background-color: var(${outer}--x, blue); } }`,
		);
	});

	await t.test('captures enclosing private names in nested private container preludes', () => {
		const outer = prefix('0');
		const inner = prefix('1');

		assert.equal(
			transpile('.a { @private { --x: red; } & { @private { @container style(--x: blue) { --y: 1px; } } } }'),
			`.a { ${outer}--x: red; & { @container style(${outer}--x: blue) { ${inner}--y: 1px; } } }`,
		);
	});

	await t.test('does not rewrite references outside the owning rule', () => {
		assert.equal(
			transpile('.a { @private { --size: 2px; } } .b { width: var(--size); } @container style(--size: 2px) { .c { color: red; } }'),
			`.a { ${prefix()}--size: 2px } .b { width: var(--size); } @container style(--size: 2px) { .c { color: red; } }`,
		);
	});

	await t.test('rewrites escaped references to the prefixed property', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --\\73 ize: 2px; } width: var(--\\73 ize); }'),
			`.a { ${p}--\\73 ize: 2px; width: var(${p}--size); }`,
		);
	});

	await t.test('ignores a bare -- property name', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --: 1px; --x: 2px; } width: var(--x); }'),
			`.a { ${p}--x: 2px; width: var(${p}--x); }`,
		);
	});

	await t.test('ignores unknown at-rule contents', () => {
		assert.equal(
			transpile('.a { @private { @foo { --x: 1px; } } width: var(--x); }'),
			'.a { width: var(--x); }',
		);
	});

	await t.test('ignores nested rule contents', () => {
		assert.equal(
			transpile('.a { @private { & .b { --x: 1px; } } width: var(--x); }'),
			'.a { width: var(--x); }',
		);
	});

	await t.test('keeps valid contents next to ignored contents', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @foo { --x: 1px; } --y: 2px; } width: var(--x) var(--y); }'),
			`.a { ${p}--y: 2px; width: var(--x) var(${p}--y); }`,
		);
	});

	await t.test('removes empty nested group rules', () => {
		assert.equal(
			transpile('.a { @private { @media (a) { color: red } @media (b) { color: blue } @media (c) { color: green } } }'),
			'.a { }',
		);
	});

	await t.test('removes deeply nested empty group rules', () => {
		assert.equal(
			transpile('.a { @private { @media (a) { @supports (b: c) { color: red } } @media (b) { color: blue } } }'),
			'.a { }',
		);
	});

	await t.test('removes empty nested group rule ancestors', () => {
		assert.equal(
			transpile('.a { @media (a) { @private { color: red } } @media (b) { @private { color: blue } } }'),
			'.a { }',
		);
	});

	await t.test('preserves empty layer blocks', () => {
		assert.equal(
			transpile('.a { @private { @layer foo { color: red } } }'),
			'.a { @layer foo { } }',
		);

		assert.equal(
			transpile('.a { @layer foo { @private { color: red } } }'),
			'.a { @layer foo { } }',
		);
	});

	await t.test('drops layer statements from private rules', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @layer a, b; --x: 1px; } width: var(--x); }'),
			`.a { ${p}--x: 1px; width: var(${p}--x); }`,
		);
	});

	await t.test('leaves invalid private rules alone', () => {
		assert.equal(
			transpile('@private { @property --x <length>: 1px; --x: 2px; }'),
			'@private { @property --x <length>: 1px; --x: 2px; }',
		);
	});

	await t.test('leaves private rules in keyframes alone', () => {
		assert.equal(
			transpile('@keyframes a { from { @private { --x: 1px; } width: var(--x); } }'),
			'@keyframes a { from { @private { --x: 1px; } width: var(--x); } }',
		);
	});
});

test('property registrations', async (t) => {
	await t.test('hoists statement form registrations', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @property --size <length>: 1px; } width: var(--size); }'),
			`.a { width: var(${p}--size); } @property ${p}--size <length>: 1px`,
		);
	});

	await t.test('hoists block form registrations', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @property --size { syntax: "<length>"; inherits: false; initial-value: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @property ${p}--size { syntax: "<length>"; inherits: false; initial-value: 1px; }`,
		);
	});

	await t.test('hoists multiple registered names', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @property --a, --b { syntax: "*"; } } width: var(--a) var(--b); }'),
			`.a { width: var(${p}--a) var(${p}--b); } @property ${p}--a, ${p}--b { syntax: "*"; }`,
		);
	});

	await t.test('uses registered names as private property names', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @property --size <length>: 1px; } --size: 2px; width: var(--size); }'),
			`.a { ${p}--size: 2px; width: var(${p}--size); } @property ${p}--size <length>: 1px`,
		);
	});

	await t.test('ignores invalid registrations', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @property 1px { syntax: "*"; } --x: 1px; } width: var(--x); }'),
			`.a { @property 1px { syntax: "*"; } ${p}--x: 1px; width: var(${p}--x); }`,
		);
	});

	await t.test('wraps registrations in @media', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @media (min-width: 1px) { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @media (min-width: 1px) { @property ${p}--size <length>: 1px; }`,
		);
	});

	await t.test('wraps registrations in @supports', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @supports (width: 1px) { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @supports (width: 1px) { @property ${p}--size <length>: 1px; }`,
		);
	});

	await t.test('wraps registrations in @layer', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @layer foo { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { @layer foo { } width: var(${p}--size); } @layer foo { @property ${p}--size <length>: 1px; }`,
		);
	});

	await t.test('wraps registrations in nested group rule ancestors', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @media (min-width: 1px) { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @media (min-width: 1px) { @property ${p}--size <length>: 1px }`,
		);

		assert.equal(
			transpile('.a { @layer foo { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { @layer foo { } width: var(${p}--size); } @layer foo { @property ${p}--size <length>: 1px }`,
		);
	});

	await t.test('ignores registrations inside @container', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --x: 1px; @container style(--x: 1) { @property --y <length>: 1px; } } width: var(--x) var(--y); }'),
			`.a { ${p}--x: 1px; @container style(${p}--x: 1) { @property --y <length>: 1px; } width: var(${p}--x) var(--y); }`,
		);

		assert.equal(
			transpile('.a { @private { @container (width > 1px) { @property --x, --y { syntax: "*"; inherits: false; } } } }'),
			'.a { @container (width > 1px) { @property --x, --y { syntax: "*"; inherits: false; } } }',
		);
	});

	await t.test('ignores registrations when the private rule is inside @container', () => {
		assert.equal(
			transpile('.a { @container (width > 1px) { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			'.a { @container (width > 1px) { @property --size <length>: 1px } width: var(--size); }',
		);
	});

	await t.test('ignores registrations when the private rule is inside @scope', () => {
		assert.equal(
			transpile('.a { @scope (.b) { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			'.a { @scope (.b) { @property --size <length>: 1px } width: var(--size); }',
		);
	});

	await t.test('ignores registrations when the private rule is inside @starting-style', () => {
		assert.equal(
			transpile('.a { @starting-style { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			'.a { @starting-style { @property --size <length>: 1px } width: var(--size); }',
		);
	});

	await t.test('transpiles declarations when the private rule is inside a group rule', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @container (width > 1px) { @private { --size: 1px; } } width: var(--size); }'),
			`.a { @container (width > 1px) { ${p}--size: 1px } width: var(${p}--size); }`,
		);

		assert.equal(
			transpile('.a { @scope (.b) { @private { --size: 1px; } } width: var(--size); }'),
			`.a { @scope (.b) { ${p}--size: 1px } width: var(${p}--size); }`,
		);
	});

	await t.test('returns registrations for each call', () => {
		const root = postcss.parse('.a { @private { @property --x <length>: 1px; } } .b { @private { @property --y <length>: 1px; } }', { from });
		const transpiler = createPrivatePropertyTranspiler({ namespace: 'm' });

		const first = transpiler.transpile([root.first]);
		const second = transpiler.transpile([root.last]);

		assert.equal(first.length, 1);
		assert.equal(second.length, 1);
		assert.ok(first[0].params.startsWith(prefix('0', 'm')));
		assert.ok(second[0].params.startsWith(prefix('1', 'm')));
	});
});
