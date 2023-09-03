const openProps = require('open-props');
const postcssBundler = require('@csstools/postcss-bundler');
const postcssCustomMedia = require('postcss-custom-media');
const postcssGlobalData = require('@csstools/postcss-global-data');
const postcssJitProps = require('postcss-jit-props');
const postcssMinify = require('@csstools/postcss-minify');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
	plugins: [
		postcssBundler(),
		postcssGlobalData({
			files: [
				'node_modules://open-props/media.min.css',
			],
		}),
		postcssCustomMedia({
			preserve: false,
		}),
		postcssJitProps(openProps),
		postcssPresetEnv({
			features: {
				'nesting-rules': true,
				'custom-media-queries': false,
			},
		}),
		postcssMinify(),
	],
};
