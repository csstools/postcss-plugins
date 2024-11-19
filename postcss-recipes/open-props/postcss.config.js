const isDevelopment = process.env.NODE_ENV === 'development';

const postcssConfig = {
	plugins: [

		require('@csstools/postcss-global-data')({
			files: [
				'./node_modules/open-props/media.min.css',
			],
		}),

		require('postcss-jit-props')({
			...require('open-props'),
			custom_selector: ':where(html)',
		}),

		require('autoprefixer'),

		require('postcss-custom-media')({
			preserve: isDevelopment,
		}),

	],
};

if (process.env.NODE_ENV === 'production') {
	postcssConfig.plugins.push(
		require('cssnano')({
			preset: 'default',
		}),
	);
}
module.exports = postcssConfig;
