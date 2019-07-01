import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.cjs.js', format: 'cjs', sourcemap: true },
		{ file: 'index.esm.mjs', format: 'es', sourcemap: true }
	],
	plugins: [
		babel({
			plugins: [
				'@babel/plugin-syntax-dynamic-import'
			],
			presets: [
				['@babel/env', { modules: false, targets: { node: 8 } }]
			]
		})
	]
};
