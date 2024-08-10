import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { externalsForPlugin } from '../configs/externals.mjs';
import { apiExtractor } from '../transforms/api-extractor.mjs';
import { nodeCoverageDisable } from '../transforms/node-coverage-disable.mjs';

export function packageTypescript(options) {
	options = options || {};
	return [
		{
			input: 'src/index.ts',
			output: [
				{ file: 'dist/index.cjs', format: 'cjs', sourcemap: false, exports: 'auto' },
			],
			external: externalsForPlugin,
			plugins: [
				typescript({
					tsconfig: './tsconfig.json',
					declaration: false,
					declarationDir: undefined,
					noEmit: false,
					noEmitOnError: true,
				}),
				// terser({
				// 	compress: {
				// 		reduce_funcs: false, // https://github.com/terser/terser/issues/1305
				// 	},
				// 	keep_classnames: true,
				// 	keep_fnames: true,
				// }),
				options.nodeCoverageDisable ? nodeCoverageDisable() : undefined,
			],
		},
		{
			input: 'src/index.ts',
			output: [
				{ file: 'dist/index.mjs', format: 'esm', sourcemap: false, exports: 'auto' },
			],
			external: externalsForPlugin,
			plugins: [
				typescript({
					tsconfig: './tsconfig.json',
					declaration: true,
					declarationDir: './dist/_types',
					noEmit: false,
					noEmitOnError: true,
				}),
				// terser({
				// 	compress: {
				// 		reduce_funcs: false, // https://github.com/terser/terser/issues/1305
				// 	},
				// 	keep_classnames: true,
				// 	keep_fnames: true,
				// }),
				options.nodeCoverageDisable ? nodeCoverageDisable() : undefined,
				apiExtractor(),
			],
		},
	];
}
