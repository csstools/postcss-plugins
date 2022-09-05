import assert from 'assert';
import plugin from '@csstools/postcss-ic-unit';
plugin({ preserve: true });

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');
