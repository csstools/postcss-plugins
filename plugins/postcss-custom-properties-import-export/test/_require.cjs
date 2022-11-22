const assert = require('assert');
const plugin = require('postcss-custom-properties');
const postcss = require('postcss');
const fs = require('fs');

plugin();

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');

postcss([plugin({ importFrom: 'test/import-properties.cjs' })]).
	process(fs.readFileSync('test/basic.css', 'utf8'), {from: 'test/basic.css'}).
	then();
