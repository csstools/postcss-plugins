import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { externalsForCLI } from '../configs/externals';
import { addHashBang } from '../transforms/cli-hash-bang';
import { packageBabelPreset } from '../configs/babel-presets';

export function cliTypescript() {
	return [
		{
			input: 'src/cli.ts',
			output: [
				{ file: 'dist/cli.cjs', format: 'cjs', sourcemap: false },
			],
			external: externalsForCLI,
			plugins: [
				typescript({ tsconfig: './tsconfig.json' }),
				commonjs(),
				nodeResolve({
					rootDir: path.join(process.cwd(), '..', '..'),
				}),
				babel({
					babelHelpers: 'bundled',
					exclude: 'node_modules/**',
					extensions: ['.js', '.ts'],
					presets: packageBabelPreset,
				}),
				terser(),
				addHashBang(),
			],
		},
	];
}
