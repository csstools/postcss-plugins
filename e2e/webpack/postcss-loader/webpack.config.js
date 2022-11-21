const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const plugin = require('postcss-custom-media-8.0.2');

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
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: { importLoaders: 1 },
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										// presetEnv,
										plugin(),
									],
								],
							},
						},
					},
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	],
};
