import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { externalsForCLI } from '../configs/externals';
import { addHashBang } from '../transforms/cli-hash-bang';
import { packageBabelPreset } from '../configs/babel-presets';

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
				terser(),
				addHashBang(),
			],
		},
	];
}
