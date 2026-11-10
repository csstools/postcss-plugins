import test from 'node:test';
import assert from 'node:assert';
import postcss from 'postcss';
import { expandPropertyRule, registeredPropertyNames } from '@csstools/utilities';

const helpers = { ...postcss, postcss, result: {} };

function propertyRule(css) {
	const root = postcss.parse(css);

	return root.first;
}

function descriptor(rule, prop) {
	return rule.nodes.find((node) => node.type === 'decl' && node.prop === prop);
}

test('expandPropertyRule', async (t) => {
	await t.test('longhand with multiple names', () => {
		const rule = propertyRule('@property --a, --b { syntax: "<length>"; }');
		const expanded = expandPropertyRule(rule, helpers);

		assert.equal(expanded.length, 2);
		assert.equal(expanded[0].params, '--a');
		assert.equal(expanded[1].params, '--b');
		assert.deepEqual(registeredPropertyNames(rule), ['--a', '--b']);
	});

	await t.test('shorthand with commas in the initial value', () => {
		const rule = propertyRule('@property --colors type(<color>#): red, blue;');
		const expanded = expandPropertyRule(rule, helpers);

		assert.equal(expanded.length, 1);
		assert.equal(expanded[0].params, '--colors');
		assert.equal(descriptor(expanded[0], 'syntax').value, '"<color>#"');
		assert.equal(descriptor(expanded[0], 'initial-value').value, 'red,blue');
		assert.deepEqual(registeredPropertyNames(rule), ['--colors']);
	});

	await t.test('shorthand with an empty initial value', () => {
		const rule = propertyRule('@property --size <length>:;');
		const expanded = expandPropertyRule(rule, helpers);

		assert.equal(expanded.length, 1);
		assert.equal(descriptor(expanded[0], 'syntax').value, '"<length>"');
		assert.equal(descriptor(expanded[0], 'initial-value').value, '');
	});

	await t.test('shorthand without an initial value', () => {
		const rule = propertyRule('@property --size <length>;');
		const expanded = expandPropertyRule(rule, helpers);

		assert.equal(expanded.length, 1);
		assert.equal(descriptor(expanded[0], 'syntax').value, '"<length>"');
		assert.equal(descriptor(expanded[0], 'initial-value'), undefined);
	});

	await t.test('rejects the reserved -- name', () => {
		const rule = propertyRule('@property -- <length>: 1em;');

		assert.equal(expandPropertyRule(rule, helpers), null);
		assert.deepEqual(registeredPropertyNames(rule), []);
	});
});
