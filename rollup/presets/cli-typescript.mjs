import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { addHashBang } from '../transforms/cli-hash-bang.mjs';
import { externalsForCLI } from '../configs/externals.mjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';

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
