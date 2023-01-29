import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import { externalsForPlugin } from '../configs/externals.mjs';
import { packageBabelPreset } from '../configs/babel-presets.mjs';

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
