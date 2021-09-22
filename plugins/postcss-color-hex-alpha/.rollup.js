import babel from '@rollup/plugin-babel'
import copy from 'rollup-plugin-copy'

export default {
	input: 'src/index.js',
	output: [
		{ file: 'dist/index.cjs', format: 'cjs', sourcemap: true, exports: 'default' },
		{ file: 'dist/index.mjs', format: 'esm', sourcemap: true },
	],
	plugins: [
		babel({
			babelHelpers: 'bundled',
			plugins: [
				'@babel/plugin-syntax-dynamic-import'
			],
			presets: [
				[
					'@babel/env',
					{
						modules: false,
						targets: {
							node: 10,
						},
					},
				],
			],
		}),
		copy({
			targets: [
				{
					src: 'src/index.d.ts',
					dest: 'dist'
				},
			],
		}),
	],
}
