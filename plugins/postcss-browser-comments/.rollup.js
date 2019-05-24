import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	output: [
		{ file: 'index.cjs.js', format: 'cjs', strict: false },
		{ file: 'index.es.js', format: 'esm', strict: false }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 8 } }]
			]
		})
	]
};
