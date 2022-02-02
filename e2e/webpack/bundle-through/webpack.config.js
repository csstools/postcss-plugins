const path = require('path');

module.exports = [
	{
		mode: 'production',
		entry: './index.mjs',
		target: 'node',
		optimization: {
			minimize: false,
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'bundle-from-mjs.cjs',
		},
	},
	{
		mode: 'production',
		entry: './index.cjs',
		target: 'node',
		optimization: {
			minimize: false,
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: 'bundle-from-cjs.cjs',
		},
	},
];
