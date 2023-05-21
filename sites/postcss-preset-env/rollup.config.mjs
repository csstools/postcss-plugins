import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';
import terser  from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
	'scripts',
	'playground',
	'blog_calc_2023_02_21',
	'blog_color_parser_2023_03_27',
	'blog_color_mix_2023_03_27',
	'blog_relative_color_syntax_2023_05_22',
].map(name => ({
	input: `src/static/js/${name}.js`,
	output: [
		{
			file: `dist/static/js/${name}.js`,
			format: 'iife',
			sourcemap: !production,
			name,
		},
	],
	plugins: [
		json(),
		nodePolyfills(),
		resolve({
			browser: true,
		}),
		commonjs(),
		babel({ babelHelpers: 'bundled' }),
		production && terser(),
		production && filesize(),
	],
}));
