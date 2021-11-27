import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'src/index.ts',
		output: [
			{ file: 'dist/index.cjs', format: 'cjs', sourcemap: true, exports: 'auto' },
			{ file: 'dist/index.mjs', format: 'esm', sourcemap: true, exports: 'auto' },
		],
		external: [
			'@csstools/postcss-plugins-values-parser',
			'fs',
			'path',
			'postcss',
			'postcss-selector-parser',
			'postcss-values-parser',
		],
		plugins: [
			typescript({ tsconfig: './tsconfig.json' }),
			babel({
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
				presets: [
					['@babel/preset-env', {
						corejs: 3,
						loose: true,
						modules: false,
						targets: { node: 12 },
						useBuiltIns: 'usage',
					}],
				],
			}),
			terser(),
		],
	},
	{
		input: 'src/cli.ts',
		output: [
			{ file: 'dist/cli.mjs', format: 'esm', sourcemap: false },
		],
		onwarn: (warning) => {
			// Silence circular dependency warning for postcss-values-parsers package
			if (
				warning.code === 'CIRCULAR_DEPENDENCY' &&
				warning.importer.indexOf('node_modules/postcss-values-parser/lib') > -1
			) {
				return;
			}

			console.warn(`(!) ${warning.message}`);
		},
		plugins: [
			typescript({ tsconfig: './tsconfig.json' }),
			commonjs(),
			nodeResolve({
				rootDir: path.join(process.cwd(), '..', '..'),
			}),
			babel({
				babelHelpers: 'bundled',
				exclude: 'node_modules/**',
				presets: [
					['@babel/preset-env', {
						corejs: 3,
						loose: true,
						modules: false,
						targets: { node: 12 },
						useBuiltIns: 'usage',
					}],
				],
			}),
			terser(),
			addHashBang(),
		],
	},
];

function addHashBang () {
	return {
		name: 'add-hash-bang',
		renderChunk (code) {
			const updatedCode = `#!/usr/bin/env node\n\n${code}`;

			return updatedCode;
		},
	};
}
