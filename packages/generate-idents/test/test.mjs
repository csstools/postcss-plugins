import test from 'node:test';
import assert from 'node:assert';
import { generateUniqueIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';

test('generateUniqueIdent', async (t) => {
	await t.test('is stable for a source file', () => {
		assert.equal(
			generateUniqueIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
		);
	});

	await t.test('differs between namespaces', () => {
		assert.notEqual(
			generateUniqueIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueIdent('m', hashFileBasenameAndDir('/a/b/c.css'), '0'),
		);
	});

	await t.test('differs between sources', () => {
		assert.notEqual(
			generateUniqueIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueIdent('p', hashFileBasenameAndDir('/a/d/c.css'), '0'),
		);
	});

	await t.test('differs between increments', () => {
		assert.notEqual(
			generateUniqueIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '1'),
		);
	});

	await t.test('handles an empty source namespace', () => {
		assert.equal(generateUniqueIdent('cf', hashFileBasenameAndDir(''), 'invalid'), '--_csstools-cf-0-invalid');
	});
});
