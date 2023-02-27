const path = require('path');
const postcssGlobalData = require('@csstools/postcss-global-data');

module.exports = {
	mode: 'production',
	entry: './index.js',
	target: 'node',
	optimization: {
		minimize: false,
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.cjs',
	},
	module: {
		rules: [
			// We document how to use our plugins together with Webpack.
			// This test validates this documentation.
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: { importLoaders: 1 },
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									postcssGlobalData({
										files: ['./props.css'],
									}),
									[
										'postcss-preset-env',
										{
											stage: 0,
											preserve: false,
										},
									],
								],
							},
						},
					},
				],
			},
		],
	},
};
