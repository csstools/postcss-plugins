import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { packageBabelPreset } from '../configs/babel-presets';
import { externalsForDeno } from '../configs/externals';

export function denoJavascript() {
	return [
		{
			input: 'src/index.js',
			output: [
				{ file: 'dist/index.deno.mjs', format: 'esm', sourcemap: true, exports: 'default' },
			],
			external: externalsForDeno,
			plugins: [
				nodeResolve({
					rootDir: path.join(process.cwd(), '..', '..'),
					browser: true,
					resolveOnly: [
						'cssesc',
						'postcss-selector-parser',
						'util-deprecate',
					],
				}),
				commonjs(),
				babel({
					babelHelpers: 'bundled',
					exclude: 'node_modules/**',
					presets: packageBabelPreset,
				}),
			],
		},
	];
}
