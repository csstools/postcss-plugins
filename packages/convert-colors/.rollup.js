import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.js', format: 'cjs', sourcemap: true },
		{ file: 'index.mjs', format: 'esm', sourcemap: true }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 6 } }]
			]
		}),
		terser()
	]
};
