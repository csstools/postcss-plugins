import babel from '@rollup/plugin-babel';
import { externalsForBrowser } from '../configs/externals';

export function browserJavascript() {
	const babelConfig = {
		babelHelpers: 'bundled',
		exclude: 'node_modules/**',
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
			],
			external: externalsForBrowser,
			plugins: [
				babel(babelConfig),
			],
		},
		{
			input: 'src/browser-global.js',
			output: [
				{ file: 'dist/browser-global.js', format: 'iife', sourcemap: true, exports: 'auto', strict: false },
			],
			external: externalsForBrowser,
			plugins: [
				babel(babelConfig),
			],
		},
	];
}
