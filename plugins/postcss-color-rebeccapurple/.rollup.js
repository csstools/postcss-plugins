import babel from '@rollup/plugin-babel'

export default {
	input: 'src/index.js',
	plugins: [
		babel({
			babelHelpers: 'bundled',
			presets: [
				['@babel/env', {
					modules: false,
					targets: { node: 10 }
				}]
			]
		})
	],
	external: [
		'postcss',
		'postcss-values-parser'
	],
	output: [
		{ file: 'dist/index.cjs.js', format: 'cjs', sourcemap: true, exports: 'default' },
		{ file: 'dist/index.esm.js', format: 'esm', sourcemap: true, exports: 'default' }
	]
}
