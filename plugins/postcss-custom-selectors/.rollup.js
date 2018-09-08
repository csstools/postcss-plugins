import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	output: [
		{ file: 'index.cjs.js', format: 'cjs' },
		{ file: 'index.es.mjs', format: 'es' }
	],
	plugins: [
		babel({
			plugins: [
				'@babel/plugin-syntax-dynamic-import'
			],
			presets: [
				['@babel/env', { modules: false, targets: { node: 6 } }]
			]
		})
	]
};
