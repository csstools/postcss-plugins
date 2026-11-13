import test from 'node:test';
import assert from 'node:assert';
import postcss from 'postcss';
import { collectPropertyRegistrations, hoistPropertyRegistrations, registeredPropertyNames, rewritePropertyNames } from '@csstools/utilities';

function propertyRule(css) {
	const root = postcss.parse(css);

	return root.first;
}

test('rewritePropertyNames', async (t) => {
	await t.test('rewrites every name in a longhand prelude list', () => {
		const rule = propertyRule('@property --a, --b { syntax: "<length>"; }');
		const names = rewritePropertyNames(rule, (name) => `--x${name.slice(2)}`);

		assert.deepEqual(names, ['--a', '--b']);
		assert.equal(rule.params, '--xa, --xb');
		assert.deepEqual(registeredPropertyNames(rule), ['--xa', '--xb']);
	});

	await t.test('rewrites the shorthand name and keeps the rest of the prelude', () => {
		const rule = propertyRule('@property --colors type(<color>#): red, blue;');
		const names = rewritePropertyNames(rule, (name) => `--x${name.slice(2)}`);

		assert.deepEqual(names, ['--colors']);
		assert.equal(rule.params, '--xcolors type(<color>#): red, blue');
	});

	await t.test('rewrites only the first name of a shorthand prelude', () => {
		const rule = propertyRule('@property --value: a, b;');
		rewritePropertyNames(rule, (name) => `--x${name.slice(2)}`);

		assert.equal(rule.params, '--xvalue: a, b');
	});

	await t.test('preserves escapes in a longhand property name', () => {
		const rule = propertyRule(String.raw`@property --x\7b { syntax: "*"; }`);
		const names = rewritePropertyNames(rule, (name) => `--p${name.slice(2)}`);

		assert.deepEqual(names, ['--x{']);

		// The rewritten name must not terminate the prelude early.
		const reparsed = postcss.parse(rule.toString());
		assert.equal(reparsed.nodes.length, 1);
		assert.equal(reparsed.first.type, 'atrule');
		assert.deepEqual(registeredPropertyNames(reparsed.first), ['--px{']);
	});

	await t.test('rejects invalid preludes', () => {
		assert.equal(rewritePropertyNames(propertyRule('@property -- <length>: 1em;'), (name) => name), null);
		assert.equal(rewritePropertyNames(propertyRule('@property --a --b { syntax: "*"; }'), (name) => name), null);
		assert.equal(rewritePropertyNames(propertyRule('@property { syntax: "*"; }'), (name) => name), null);
	});
});

test('collectPropertyRegistrations', async (t) => {
	await t.test('collects nested registrations with their conditionals', () => {
		const root = postcss.parse('@private { @media (width > 1px) { @property --a { syntax: "*"; } } }');
		const collected = collectPropertyRegistrations(root.first, {
			isConditional: (node) => node.name === 'media',
			shouldDescend: () => true,
		});

		assert.equal(collected.length, 1);
		assert.equal(collected[0].atRule.name, 'property');
		assert.deepEqual(collected[0].conditionals.map((node) => node.name), ['media']);
	});

	await t.test('does not descend when the policy says no', () => {
		const root = postcss.parse('@private { @media (width > 1px) { @property --a { syntax: "*"; } } }');
		const collected = collectPropertyRegistrations(root.first, {
			isConditional: () => true,
			shouldDescend: () => false,
		});

		assert.deepEqual(collected, []);
	});
});

test('hoistPropertyRegistrations', async (t) => {
	await t.test('rewrites names and removes the originals', () => {
		const root = postcss.parse('@media (width > 1px) { @property --a, --b { syntax: "*"; } }');
		const media = root.first;
		const collected = collectPropertyRegistrations(media, {
			isConditional: () => false,
			shouldDescend: () => true,
		});

		const result = hoistPropertyRegistrations(collected, {
			rewrite: (name) => `--x${name.slice(2)}`,
			removeOriginal: true,
		});

		assert.deepEqual(result.names, ['--a', '--b']);
		assert.equal(media.nodes.length, 0);
		assert.deepEqual(registeredPropertyNames(result.registrations[0]), ['--xa', '--xb']);
	});

	await t.test('wraps registrations in the conditionals around them', () => {
		const root = postcss.parse('@private { @media (width > 1px) { @property --a { syntax: "*"; } } }');
		const collected = collectPropertyRegistrations(root.first, {
			isConditional: (node) => node.name === 'media',
			shouldDescend: () => true,
		});

		const result = hoistPropertyRegistrations(collected, {
			rewrite: (name) => name,
			removeOriginal: true,
		});

		assert.equal(result.registrations[0].name, 'media');
		assert.equal(result.registrations[0].first.name, 'property');
	});
});
