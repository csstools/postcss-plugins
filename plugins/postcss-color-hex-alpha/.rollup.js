import babel from '@rollup/plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true, exports: 'default' },
		{ file: 'dist/index.es.mjs', format: 'es', sourcemap: true, exports: 'default' }
	],
	plugins: [
		babel({
			babelHelpers: 'bundled',
			plugins: [
				'@babel/plugin-syntax-dynamic-import'
			],
			presets: [
				['@babel/env', { modules: false, targets: { node: 10 } }]
			]
		})
	]
};
