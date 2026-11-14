import test from 'node:test';
import assert from 'node:assert';
import { generateUniqueDashedIdent, hashFileBasenameAndDir } from '@csstools/generate-idents';

test('generateUniqueDashedIdent', async (t) => {
	await t.test('is stable for a source file', () => {
		assert.equal(
			generateUniqueDashedIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueDashedIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
		);
	});

	await t.test('differs between namespaces', () => {
		assert.notEqual(
			generateUniqueDashedIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueDashedIdent('m', hashFileBasenameAndDir('/a/b/c.css'), '0'),
		);
	});

	await t.test('differs between sources', () => {
		assert.notEqual(
			generateUniqueDashedIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueDashedIdent('p', hashFileBasenameAndDir('/a/d/c.css'), '0'),
		);
	});

	await t.test('differs between increments', () => {
		assert.notEqual(
			generateUniqueDashedIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '0'),
			generateUniqueDashedIdent('p', hashFileBasenameAndDir('/a/b/c.css'), '1'),
		);
	});

	await t.test('handles an empty source namespace', () => {
		assert.equal(generateUniqueDashedIdent('cf', hashFileBasenameAndDir(), 'invalid'), '--_csstools-cf-0-invalid');
		assert.equal(generateUniqueDashedIdent('cf', hashFileBasenameAndDir(''), 'invalid'), '--_csstools-cf-0-invalid');
	});
});
