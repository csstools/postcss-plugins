import assert from 'node:assert';
import plugin from 'css-prefers-color-scheme';
plugin();

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');
