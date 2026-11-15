import test from 'node:test';
import assert from 'node:assert';
import postcss from 'postcss';
import { collectPropertyRegistrations, hoistPropertyRegistrations, registeredCustomPropertyNames, rewriteCustomPropertyNames } from '@csstools/utilities-for-property-registrations';

function propertyRule(css) {
	const root = postcss.parse(css);

	return root.first;
}

test('rewriteCustomPropertyNames', async (t) => {
	await t.test('rewrites every name in a rule form prelude list', () => {
		const rule = propertyRule('@property --a, --b { syntax: "<length>"; }');
		const names = rewriteCustomPropertyNames(rule, (name) => `--x${name.slice(2)}`);

		assert.deepEqual(names, ['--a', '--b']);
		assert.equal(rule.params, '--xa, --xb');
		assert.deepEqual(registeredCustomPropertyNames(rule), ['--xa', '--xb']);
	});

	await t.test('rewrites the statement form name and keeps the rest of the prelude', () => {
		const rule = propertyRule('@property --colors type(<color>#): red, blue;');
		const names = rewriteCustomPropertyNames(rule, (name) => `--x${name.slice(2)}`);

		assert.deepEqual(names, ['--colors']);
		assert.equal(rule.params, '--xcolors type(<color>#): red, blue');
	});

	await t.test('does not treat the statement form initial value as a list of names', () => {
		const rule = propertyRule('@property --value: a, b;');
		rewriteCustomPropertyNames(rule, (name) => `--x${name.slice(2)}`);

		assert.equal(rule.params, '--xvalue: a, b');
	});

	await t.test('preserves escapes in a rule form custom property name', () => {
		const rule = propertyRule(String.raw`@property --x\7b { syntax: "*"; }`);
		const names = rewriteCustomPropertyNames(rule, (name) => `--p${name.slice(2)}`);

		assert.deepEqual(names, ['--x{']);

		// The rewritten name must not terminate the prelude early.
		const reparsed = postcss.parse(rule.toString());
		assert.equal(reparsed.nodes.length, 1);
		assert.equal(reparsed.first.type, 'atrule');
		assert.deepEqual(registeredCustomPropertyNames(reparsed.first), ['--px{']);
	});

	await t.test('rejects invalid preludes', () => {
		assert.equal(rewriteCustomPropertyNames(propertyRule('@property -- <length>: 1em;'), (name) => name), null);
		assert.equal(rewriteCustomPropertyNames(propertyRule('@property --a --b { syntax: "*"; }'), (name) => name), null);
		assert.equal(rewriteCustomPropertyNames(propertyRule('@property { syntax: "*"; }'), (name) => name), null);
		assert.equal(rewriteCustomPropertyNames(propertyRule('@property;'), (name) => name), null);
	});
});

test('collectPropertyRegistrations', async (t) => {
	await t.test('collects nested registrations with their conditional group rules', () => {
		const root = postcss.parse('@private { @media (width > 1px) { @property --a { syntax: "*"; } } }');
		const collected = collectPropertyRegistrations(root.first, {
			isConditionalGroupRule: (node) => node.name === 'media',
			shouldDescendInto: () => true,
		});

		assert.equal(collected.length, 1);
		assert.equal(collected[0].propertyRule.name, 'property');
		assert.deepEqual(collected[0].conditionalGroupRules.map((node) => node.name), ['media']);
	});

	await t.test('does not descend when the policy says no', () => {
		const root = postcss.parse('@private { @media (width > 1px) { @property --a { syntax: "*"; } } }');
		const collected = collectPropertyRegistrations(root.first, {
			isConditionalGroupRule: () => true,
			shouldDescendInto: () => false,
		});

		assert.deepEqual(collected, []);
	});
});

test('hoistPropertyRegistrations', async (t) => {
	await t.test('rewrites names and removes the originals', () => {
		const root = postcss.parse('@media (width > 1px) { @property --a, --b { syntax: "*"; } }');
		const media = root.first;
		const collected = collectPropertyRegistrations(media, {
			isConditionalGroupRule: () => false,
			shouldDescendInto: () => true,
		});

		const result = hoistPropertyRegistrations(collected, {
			rewriteCustomPropertyName: (name) => `--x${name.slice(2)}`,
			removeOriginal: true,
		});

		assert.deepEqual(result.originalNames, ['--a', '--b']);
		assert.equal(media.nodes.length, 0);
		assert.deepEqual(registeredCustomPropertyNames(result.registrations[0]), ['--xa', '--xb']);
	});

	await t.test('keeps registrations that cannot be rewritten', () => {
		const root = postcss.parse('@media (width > 1px) { @property 1px { syntax: "*"; } }');
		const media = root.first;
		const collected = collectPropertyRegistrations(media, {
			isConditionalGroupRule: () => false,
			shouldDescendInto: () => true,
		});

		const result = hoistPropertyRegistrations(collected, {
			rewriteCustomPropertyName: (name) => name,
			removeOriginal: true,
		});

		assert.deepEqual(result.registrations, []);
		assert.deepEqual(result.originalNames, []);
		assert.equal(media.nodes.length, 1);
		assert.equal(media.first.name, 'property');
	});

	await t.test('keeps the originals when not removing them', () => {
		const root = postcss.parse('@media (width > 1px) { @property --a { syntax: "*"; } }');
		const media = root.first;
		const collected = collectPropertyRegistrations(media, {
			isConditionalGroupRule: () => false,
			shouldDescendInto: () => true,
		});

		const result = hoistPropertyRegistrations(collected, {
			rewriteCustomPropertyName: (name) => `--x${name.slice(2)}`,
		});

		assert.deepEqual(result.originalNames, ['--a']);
		assert.equal(media.nodes.length, 1);
		assert.deepEqual(registeredCustomPropertyNames(media.first), ['--a']);
		assert.deepEqual(registeredCustomPropertyNames(result.registrations[0]), ['--xa']);
	});

	await t.test('wraps registrations in the conditional group rules around them', () => {
		const root = postcss.parse('@private { @media (width > 1px) { @property --a { syntax: "*"; } } }');
		const collected = collectPropertyRegistrations(root.first, {
			isConditionalGroupRule: (node) => node.name === 'media',
			shouldDescendInto: () => true,
		});

		const result = hoistPropertyRegistrations(collected, {
			rewriteCustomPropertyName: (name) => name,
			removeOriginal: true,
		});

		assert.equal(result.registrations[0].name, 'media');
		assert.equal(result.registrations[0].first.name, 'property');
	});
});
