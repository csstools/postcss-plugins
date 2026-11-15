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

		assert.equal(
			transpile('.a { @private { @foo { @property --x <length>: 1px; } } width: var(--x); }'),
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

	await t.test('hoists registrations out of @container', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --x: 1px; @container style(--x: 1) { @property --y <length>: 1px; } } width: var(--x) var(--y); }'),
			`.a { ${p}--x: 1px; width: var(${p}--x) var(${p}--y); } @property ${p}--y <length>: 1px`,
		);

		assert.equal(
			transpile('.a { @private { @container (width > 1px) { @property --x, --y { syntax: "*"; inherits: false; } } } }'),
			`.a { } @property ${p}--x, ${p}--y { syntax: "*"; inherits: false; }`,
		);
	});

	await t.test('drops declarations that are not custom properties', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { color: red; --x: 1px; } width: var(--x); }'),
			`.a { ${p}--x: 1px; width: var(${p}--x); }`,
		);
	});

	await t.test('ignores arguments that are not custom property names', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --x: 1px; } width: var(--x) var(1px) var(red); }'),
			`.a { ${p}--x: 1px; width: var(${p}--x) var(1px) var(red); }`,
		);
	});

	await t.test('ignores container rules without private references', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --x: 1px; } @container (width > 1px) { color: red; } @container style(--x: 1) { color: blue; } }'),
			`.a { ${p}--x: 1px; @container (width > 1px) { color: red; } @container style(${p}--x: 1) { color: blue; } }`,
		);
	});

	await t.test('uses the nearest style rule as the owner of a private property', () => {
		const outer = prefix('0');
		const inner = prefix('1');

		assert.equal(
			transpile('.a { @private { --x: 1px; } & .b { @private { @property --y <length>: 2px; } width: var(--x) var(--y); } }'),
			`.a { ${outer}--x: 1px; & .b { width: var(${outer}--x) var(${inner}--y); } } @property ${inner}--y <length>: 2px`,
		);
	});

	await t.test('collects private property names from all conditional group rules', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --x: 1px; } @media (a) { @private { --y: 2px; } } width: var(--x) var(--y); }'),
			`.a { ${p}--x: 1px; @media (a) { ${p}--y: 2px } width: var(${p}--x) var(${p}--y); }`,
		);
	});

	await t.test('combines registrations and declarations from separate private rules', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @property --x <length>: 1px; } @private { --x: 2px; } width: var(--x); }'),
			`.a { ${p}--x: 2px; width: var(${p}--x); } @property ${p}--x <length>: 1px`,
		);
	});

	await t.test('hoists registrations when the private rule is inside @container', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @container (width > 1px) { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @property ${p}--size <length>: 1px`,
		);
	});

	await t.test('hoists registrations when the private rule is inside @scope', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @scope (.b) { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @property ${p}--size <length>: 1px`,
		);
	});

	await t.test('hoists registrations when the private rule is inside @starting-style', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @starting-style { @private { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @property ${p}--size <length>: 1px`,
		);
	});

	await t.test('hoists registrations out of @scope and @starting-style', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @scope (.b) { @property --size <length>: 1px; } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @property ${p}--size <length>: 1px`,
		);

		assert.equal(
			transpile('.a { @private { @starting-style { @property --size <length>: 1px; --size: 2px; } } width: var(--size); }'),
			`.a { @starting-style { ${p}--size: 2px; } width: var(${p}--size); } @property ${p}--size <length>: 1px`,
		);
	});

	await t.test('keeps @media around registrations that are hoisted out of @container', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @container (width > 1px) { @media (min-width: 1px) { @property --size <length>: 1px; } } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @media (min-width: 1px) { @property ${p}--size <length>: 1px; }`,
		);

		assert.equal(
			transpile('.a { @container (width > 1px) { @private { @media (min-width: 1px) { @property --size <length>: 1px; } } } width: var(--size); }'),
			`.a { width: var(${p}--size); } @media (min-width: 1px) { @property ${p}--size <length>: 1px; }`,
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

test('the same private name can be registered in several layers', async (t) => {
	await t.test('keeps the full named layer chain', () => {
		const p = prefix();

		assert.equal(
			transpile('@layer outer { .a { @private { @layer inner { @property --x <length>: 1px; } } } }'),
			`@layer outer { .a { @layer inner { } } }@layer outer { @layer inner { @property ${p}--x <length>: 1px; } }`,
		);
	});

	await t.test('keeps layer precedence between registrations of the same name', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @layer first { @property --x <length>: 1px; } @layer second { @property --x <color>: red; } } }'),
			`.a { @layer first { } @layer second { } } @layer first { @property ${p}--x <length>: 1px; } @layer second { @property ${p}--x <color>: red; }`,
		);
	});

	await t.test('leaves the style rule untouched when a layer is anonymous', () => {
		for (const css of [
			'.a { @private { @layer { @property --x <length>: 1px; } } width: var(--x); }',
			'.a { @private { @layer { @property --x <length>: 1px; } @layer second { @property --x <color>: red; } } width: var(--x); }',
			'@layer { @layer named { .a { @private { @property --x <length>: 1px; } } width: var(--x); } }',
			'@media (min-width: 1px) { @layer { .a { @private { @property --x <length>: 1px; } } width: var(--x); } }',
		]) {
			assert.equal(transpile(css), css);
		}
	});
});

test('conditional registrations', async (t) => {
	await t.test('keeps @media and @supports above the style rule', () => {
		const p = prefix();

		assert.equal(
			transpile('@media (min-width: 1px) { .a { @private { @property --x <length>: 1px; } } }'),
			`@media (min-width: 1px) { .a { } }@media (min-width: 1px) { @property ${p}--x <length>: 1px }`,
		);

		assert.equal(
			transpile('@supports (width: 1px) { @media (min-width: 1px) { .a { @private { @property --x <length>: 1px; } } } }'),
			`@supports (width: 1px) { @media (min-width: 1px) { .a { } } }@supports (width: 1px) { @media (min-width: 1px) { @property ${p}--x <length>: 1px } }`,
		);
	});

	await t.test('keeps conditions around declarations and registrations together', () => {
		const p = prefix();

		assert.equal(
			transpile('@media (min-width: 1px) { .a { @container (width > 10px) { @private { @layer inner { @property --x <length>: 1em; --x: 2em; } } } width: var(--x); } }'),
			`@media (min-width: 1px) { .a { @container (width > 10px) { @layer inner { ${p}--x: 2em; } } width: var(${p}--x); } }@media (min-width: 1px) { @layer inner { @property ${p}--x <length>: 1em; } }`,
		);
	});
});

test('transition references', async (t) => {
	await t.test('renames private property names in transition and transition-property', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { @property --x <length>: 1px; --x: 2px; } transition: --x 1s; transition-property: --x, width; will-change: --x; }'),
			`.a { ${p}--x: 2px; transition: ${p}--x 1s; transition-property: ${p}--x, width; will-change: --x; } @property ${p}--x <length>: 1px`,
		);
	});

	await t.test('renames escaped transition references', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --\\73 ize: 1px; } transition: --\\73 ize 1s; }'),
			`.a { ${p}--\\73 ize: 1px; transition: ${p}--size 1s; }`,
		);
	});
});

test('untranspilable combinations are left untouched', async (t) => {
	await t.test('leaves a style rule with an @apply rule untouched', () => {
		for (const css of [
			'.a { @private { --x: 1px; } @apply --m; width: var(--x); }',
			'.a { @private { --x: 1px; } @apply --m { color: var(--x); } width: var(--x); }',
			'.a { @private { --x: 1px; } & .b { @apply --m; width: var(--x); } width: var(--x); }',
			'.a { @private { --x: 1px; } @contents { color: red; } width: var(--x); }',
		]) {
			assert.equal(transpile(css), css);
		}
	});

	await t.test('leaves style rules inside @mixin and @function untouched', () => {
		for (const css of [
			'@mixin --m() { .a { @private { --x: 1px; } width: var(--x); } }',
			'@function --f() { .a { @private { --x: 1px; } width: var(--x); } }',
		]) {
			assert.equal(transpile(css), css);
		}
	});

	await t.test('still transpiles other style rules', () => {
		const p = prefix();

		assert.equal(
			transpile('.a { @private { --x: 1px; } @apply --m; } .b { @private { --y: 2px; } width: var(--y); }'),
			`.a { @private { --x: 1px; } @apply --m; } .b { ${p}--y: 2px; width: var(${p}--y); }`,
		);
	});
});
