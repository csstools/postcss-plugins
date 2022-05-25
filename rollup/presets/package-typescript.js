import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import { packageBabelPreset } from '../configs/babel-presets';
import { externalsForPlugin } from '../configs/externals';

export function packageTypescript(pkg) {
	return Object.keys(pkg.exports).map((exportKey) => {
		const cjsFileName = pkg.exports[exportKey].require;
		const mjsFileName = pkg.exports[exportKey].import;
		const input = path.resolve('/src/', exportKey, './index.ts').slice(1);

		return {
			input,
			output: [
				{ file: cjsFileName, format: 'cjs', sourcemap: false, exports: 'auto' },
				{ file: mjsFileName, format: 'esm', sourcemap: false, exports: 'auto' },
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
		};
	});
}
