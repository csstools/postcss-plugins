import assert from 'node:assert';
import plugin from '@csstools/postcss-media-queries-aspect-ratio-number-values';
plugin();

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');
