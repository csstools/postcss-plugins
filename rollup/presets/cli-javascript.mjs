import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import terser from '@rollup/plugin-terser';
import { addHashBang } from '../transforms/cli-hash-bang.mjs';
import { externalsForCLI } from '../configs/externals.mjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { packageBabelPreset } from '../configs/babel-presets.mjs';

export function cliJavascript() {
	return [
		{
			input: 'src/cli.js',
			output: [
				{ file: 'dist/cli.cjs', format: 'cjs', sourcemap: false },
			],
			external: externalsForCLI,
			plugins: [
				commonjs(),
				nodeResolve({
					rootDir: path.join(process.cwd(), '..', '..'),
				}),
				babel({
					babelHelpers: 'bundled',
					exclude: 'node_modules/**',
					presets: packageBabelPreset,
				}),
				terser({
					compress: {
						reduce_funcs: false, // https://github.com/terser/terser/issues/1305
					},
					keep_classnames: true,
					keep_fnames: true,
				}),
				addHashBang(),
			],
		},
	];
}
