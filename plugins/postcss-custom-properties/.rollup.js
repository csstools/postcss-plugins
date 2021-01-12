import babel from '@rollup/plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.cjs.js', format: 'cjs', sourcemap: true, exports: 'default' },
		{ file: 'index.esm.mjs', format: 'esm', sourcemap: true, exports: 'default' }
	],
	plugins: [
		babel({
			babelHelpers: 'bundled',
			plugins: [
				'@babel/plugin-syntax-dynamic-import'
			],
			presets: [
				['@babel/preset-env', {
					corejs: 3,
					loose: true,
					modules: false,
					targets: { node: 10 },
					useBuiltIns: 'entry'
				}]
			]
		})
	]
};
