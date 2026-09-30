const assert = require('node:assert/strict');
const test = require('node:test');
const plugin = require('@csstools/postcss-property-rule-optional-descriptors');

test('require', () => {
	plugin();
	assert.ok(plugin.postcss, 'should have "postcss flag"');
	assert.equal(typeof plugin, 'function', 'should return a function');
});
