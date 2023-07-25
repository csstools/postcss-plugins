import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { externalsForPlugin } from '../configs/externals.mjs';
import { packageBabelPreset } from '../configs/babel-presets.mjs';

export function packageTypescript() {
	return [
		{
			input: 'src/index.ts',
			output: [
				{ file: 'dist/index.cjs', format: 'cjs', sourcemap: false, exports: 'auto' },
				{ file: 'dist/index.mjs', format: 'esm', sourcemap: false, exports: 'auto' },
			],
			external: externalsForPlugin,
			plugins: [
				typescript({ tsconfig: './tsconfig.json' }),
				babel({
					babelHelpers: 'bundled',
					exclude: 'node_modules/**',
					extensions: ['.js', '.ts'],
					presets: packageBabelPreset,
				}),
				terser({
					compress: {
						reduce_funcs: false, // https://github.com/terser/terser/issues/1305
					},
					keep_classnames: true,
					keep_fnames: true,
				}),
			],
		},
	];
}
