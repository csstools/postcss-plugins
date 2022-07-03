import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { externalsForBrowser } from '../configs/externals';

export function browserJavascript() {
	const babelConfig = {
		babelHelpers: 'bundled',
		presets: [
			['@babel/preset-env', {
				loose: true,
				modules: false,
				targets: {
					browsers: [
						'IE >= 8',
						'Opera >= 12',
						'Safari >= 5.1',
						'Chrome >= 15',
						'Edge >= 12',
						'Firefox >= 4',
					],
				},
				useBuiltIns: false,
			}],
		],
	};

	return [
		{
			input: 'src/browser.js',
			output: [
				{ file: 'dist/browser.cjs', format: 'cjs', sourcemap: true, exports: 'auto', strict: false },
				{ file: 'dist/browser.mjs', format: 'esm', sourcemap: true, exports: 'auto', strict: false },
			],
			external: externalsForBrowser,
			plugins: [
				commonjs({
					include: [ 'src/browser.js', 'node_modules/**' ],
				}),
				nodeResolve({
					rootDir: path.join(process.cwd(), '..', '..'),
				}),
				babel(babelConfig),
				terser(),
			],
		},
		{
			input: 'src/browser-global.js',
			output: [
				{ file: 'dist/browser-global.js', format: 'iife', sourcemap: true, exports: 'auto', strict: false },
			],
			external: externalsForBrowser,
			plugins: [
				commonjs({
					include: [ 'src/browser.js', 'node_modules/**' ],
				}),
				nodeResolve({
					rootDir: path.join(process.cwd(), '..', '..'),
				}),
				babel(babelConfig),
				terser(),
			],
		},
	];
}
