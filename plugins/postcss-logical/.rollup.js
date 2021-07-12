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
			presets: [
				['@babel/env', { modules: false, targets: { node: 10 } }]
			]
		})
	]
};
