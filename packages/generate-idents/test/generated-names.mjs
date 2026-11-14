import test from 'node:test';
import assert from 'node:assert';
import { generatedName } from '@csstools/generate-idents';

test('generatedName', async (t) => {
	await t.test('is stable for a source file', () => {
		assert.equal(
			generatedName('p', '/a/b/c.css', '0'),
			generatedName('p', '/a/b/c.css', '0'),
		);
	});

	await t.test('only uses the last two path segments', () => {
		assert.equal(
			generatedName('p', '/a/b/c.css', '0'),
			generatedName('p', '/x/b/c.css', '0'),
		);
	});

	await t.test('differs between namespaces, files and suffixes', () => {
		assert.notEqual(
			generatedName('p', '/a/b/c.css', '0'),
			generatedName('m', '/a/b/c.css', '0'),
		);
		assert.notEqual(
			generatedName('p', '/a/b/c.css', '0'),
			generatedName('p', '/a/d/c.css', '0'),
		);
		assert.notEqual(
			generatedName('p', '/a/b/c.css', '0'),
			generatedName('p', '/a/b/c.css', '1'),
		);
	});

	await t.test('handles a missing source', () => {
		assert.equal(generatedName('cf', undefined, 'invalid'), '--_csstools-cf-0-invalid');
	});
});
