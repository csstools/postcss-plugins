import babel from 'rollup-plugin-babel';

export default {
	input: 'src/client.js',
	output: [
		{ file: 'client.js', format: 'cjs' },
		{ file: 'client.mjs', format: 'es' }
	],
	plugins: [
		babel({
			presets: [
				['@babel/env', { modules: false, targets: { node: 6 } }]
			]
		})
	]
};
