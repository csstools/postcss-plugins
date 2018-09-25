import babel from 'rollup-plugin-babel';

export default {
	input: 'src/postcss.js',
	output: [
		{ file: 'postcss.js', format: 'cjs' },
		{ file: 'postcss.mjs', format: 'es' }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 6 } }]
			]
		})
	]
};
