import test from 'node:test';
import assert from 'node:assert';
import postcss from 'postcss';
import { registeredPropertyNames, rewritePropertyNames } from '@csstools/utilities';

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
