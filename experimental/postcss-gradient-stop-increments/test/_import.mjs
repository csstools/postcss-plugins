import assert from 'node:assert';
import plugin from '@csstools/postcss-gradient-stop-increments-experimental';
plugin();

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');
