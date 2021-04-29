import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	output: [
		{ file: 'index.cjs', format: 'cjs', exports: 'default', sourcemap: true, strict: false },
		{ file: 'index.mjs', format: 'esm', sourcemap: true, strict: false }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 8 } }]
			]
		})
	]
};
