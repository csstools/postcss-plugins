const postcssNormalize = require('postcss-normalize');
const postcssImport = require('postcss-import');
const postcssModulesValues = require('postcss-modules-values');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = () => ({
	map: false,
	plugins: [
		postcssNormalize(),
		postcssImport({ path: ['node_modules', '../node_modules'] }),
		postcssModulesValues(),
		postcssPresetEnv({
			features: {
				'custom-media-queries': true,
				'nesting-rules': true,
			},
		}),
	],
});
