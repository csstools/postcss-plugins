import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import filesize from 'rollup-plugin-filesize';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const production = !process.env.ROLLUP_WATCH;

export default [
	'scripts',
	'playground',
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
