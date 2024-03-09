import assert from 'assert';
import plugin from 'postcss-preset-env';
plugin({
	preserve: true,
	features: {
		'all-property': [true, { preserve: true }],
		'any-link-pseudo-class': [false, { preserve: true }],
		'cascade-layers': ['auto', { onImportLayerRule: 'warn' }],
		'color-function': { preserve: true, enableProgressiveCustomProperties: false },
		'color-mix': false,
		'light-dark-function': true,
	},
});

assert.ok(plugin.postcss, 'should have "postcss flag"');
assert.equal(typeof plugin, 'function', 'should return a function');
