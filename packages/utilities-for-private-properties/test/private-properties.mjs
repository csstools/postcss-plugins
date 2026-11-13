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

		transpiler.transpile(root.nodes);

		const output = root.toString();
		assert.ok(output.includes(`${generatedName('m', from, '0')}--x`));
		assert.ok(output.includes(`${generatedName('m', from, '1')}--y`));
	});

	await t.test('leaves invalid private rules alone', () => {
		const css = '@private { --x: 1px; }';

		assert.equal(transpile(css), css);
	});
});
