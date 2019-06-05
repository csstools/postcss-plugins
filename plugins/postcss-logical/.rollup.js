import babel from 'rollup-plugin-babel';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.cjs.js', format: 'cjs', sourcemap: true, strict: false },
		{ file: 'index.esm.mjs', format: 'esm', sourcemap: true, strict: false }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 8 } }]
			]
		})
	]
};
