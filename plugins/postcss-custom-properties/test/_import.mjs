import assert from 'assert';
import plugin from 'postcss-custom-properties';
import postcss from 'postcss';
import fs from 'fs';

plugin();

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');

postcss([plugin({ importFrom: 'test/import-properties.cjs' })]).
	process(fs.readFileSync('test/basic.css', 'utf8'), {from: 'test/basic.css'}).
	then();

postcss([plugin({ importFrom: 'test/import-properties.mjs' })]).
	process(fs.readFileSync('test/basic.css', 'utf8'), {from: 'test/basic.css'}).
	then();
