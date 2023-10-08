const postcssBundler = require('@csstools/postcss-bundler');
const postcssMinify = require('@csstools/postcss-minify');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
	plugins: [
		postcssBundler(),
		postcssPresetEnv(),
		postcssMinify(),
	],
};
