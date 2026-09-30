import terser from '@rollup/plugin-terser';
import { externalsForPlugin } from '../configs/externals.mjs';

export function packageJavascript() {
	return [
		{
			input: 'src/index.js',
			output: [
				{ file: 'dist/index.mjs', format: 'esm', sourcemap: false, exports: 'auto' },
			],
			external: externalsForPlugin,
			plugins: [
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
