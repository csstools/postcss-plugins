import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'path';
import { fork, parse } from 'css-tree';

const patches = JSON.parse(await fs.readFile(path.join('dist', 'index.json'), 'utf-8')).next;

test('container-query type is defined in patch output', () => {
	assert.ok(
		patches.types['container-query'],
		'container-query must be in patch output because container-condition and query-in-parens reference it',
	);
});

test('@container prelude validates without error', () => {
	const forkedLexer = fork({
		atrules: patches.atrules,
		properties: patches.properties,
		types: patches.types,
	}).lexer;

	const prelude = parse('(min-width: 768px)', { context: 'atrulePrelude', atrule: 'container' });
	const result = forkedLexer.matchAtrulePrelude('container', prelude);
	assert.equal(result.error, null, `should validate @container prelude, got: ${result.error?.message}`);
});
