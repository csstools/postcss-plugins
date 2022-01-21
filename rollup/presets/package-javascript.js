import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { packageBabelPreset } from '../configs/babel-presets';
import { externalsForPlugin } from '../configs/externals';

export function packageJavascript() {
	return [
		{
			input: 'src/index.js',
			output: [
				{ file: 'dist/index.cjs', format: 'cjs', sourcemap: false, exports: 'auto' },
				{ file: 'dist/index.mjs', format: 'esm', sourcemap: false, exports: 'auto' },
			],
			external: externalsForPlugin,
			plugins: [
				babel({
					babelHelpers: 'bundled',
					exclude: 'node_modules/**',
					presets: packageBabelPreset,
				}),
				terser(),
			],
		},
	];
}
