import assert from 'node:assert/strict';
import test from 'node:test';
import plugin from '@csstools/postcss-mixins';

test('import', () => {
	plugin();
	assert.ok(plugin.postcss, 'should have "postcss flag"');
	assert.equal(typeof plugin, 'function', 'should return a function');
});

