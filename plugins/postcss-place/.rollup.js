import babel from '@rollup/plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'dist/index.js', format: 'cjs', sourcemap: true, exports: 'default' },
		{ file: 'dist/index.mjs', format: 'esm', sourcemap: true, exports: 'default' }
	],
	plugins: [
		babel({
			babelHelpers: 'bundled',
			presets: [
				['@babel/preset-env', {
					corejs: 3,
					loose: true,
					modules: false,
					targets: { node: 12 },
					useBuiltIns: 'entry'
				}]
			]
		}),
	],
	onwarn(warning, warn) {
		if (warning.code !== 'UNRESOLVED_IMPORT') warn(warning)
	}
}
