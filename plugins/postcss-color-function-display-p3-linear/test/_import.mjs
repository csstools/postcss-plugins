import assert from 'node:assert';
import plugin from '@csstools/postcss-color-function-display-p3-linear';
plugin();

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');
