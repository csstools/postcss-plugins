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
