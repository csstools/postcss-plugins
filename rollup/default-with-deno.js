import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'src/index.js',
		output: [
			{ file: 'dist/index.cjs', format: 'cjs', sourcemap: true, exports: 'auto' },
			{ file: 'dist/index.mjs', format: 'esm', sourcemap: true, exports: 'auto' },
		],
		external: [
			'postcss-values-parser',
			'postcss-selector-parser',
		],
		plugins: [
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
		input: 'src/cli.js',
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
	{
		input: 'src/index.js',
		output: [
			{ file: 'dist/index.deno.mjs', format: 'esm', sourcemap: true, exports: 'default' },
		],
		plugins: [
			commonjs(),
			nodeResolve({
				rootDir: path.join(process.cwd(), '..', '..'),
				browser: true,
				resolveOnly: [
					'cssesc',
					'postcss-selector-parser',
					'util-deprecate',
				],
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
