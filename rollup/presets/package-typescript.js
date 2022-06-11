import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import { packageBabelPreset } from '../configs/babel-presets';
import { externalsForPlugin } from '../configs/externals';

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
				terser(),
			],
		},
	];
}
