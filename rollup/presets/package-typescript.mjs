import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { externalsForPlugin } from '../configs/externals.mjs';
import { typescriptDeclarations } from '../transforms/typescript-declarations.mjs';

export function packageTypescript() {
	return [
		{
			input: 'src/index.ts',
			output: [
				{ file: 'dist/index.cjs', format: 'cjs', sourcemap: false, exports: 'auto' },
			],
			external: externalsForPlugin,
			plugins: [
				typescript({
					tsconfig: './tsconfig.json',
					declaration: false,
					declarationDir: undefined,
					noEmit: false,
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
		{
			input: 'src/index.ts',
			output: [
				{ file: 'dist/index.mjs', format: 'esm', sourcemap: false, exports: 'auto' },
			],
			external: externalsForPlugin,
			plugins: [
				typescript({
					tsconfig: './tsconfig.json',
					declaration: true,
					declarationDir: './dist/_types',
					noEmit: false,
				}),
				terser({
					compress: {
						reduce_funcs: false, // https://github.com/terser/terser/issues/1305
					},
					keep_classnames: true,
					keep_fnames: true,
				}),
				typescriptDeclarations(),
			],
		},
	];
}
