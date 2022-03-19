import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import filesize from 'rollup-plugin-filesize';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default ['scripts'].map(name => ({
	input: `src/static/js/${name}.js`,
	output: [
		{
			file: `dist/static/js/${name}.js`,
			format: 'es',
			sourcemap: !production,
			name,
		},
	],
	plugins: [
		resolve({
			browser: true,
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production,
		}),
		babel({ babelHelpers: 'bundled' }),
		production && terser(),
		production && filesize(),
	],
}));
