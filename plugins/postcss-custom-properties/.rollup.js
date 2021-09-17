import babel from '@rollup/plugin-babel';
import { copy } from '@web/rollup-plugin-copy'

export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.cjs', format: 'cjs', exports: 'default' },
		{ file: 'index.mjs', format: 'esm' }
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
					targets: { node: 12 },
					useBuiltIns: 'entry'
				}]
			]
		}),
		copy({
			rootDir: './src',
			patterns: 'index.d.ts'
		}),
	]
};
