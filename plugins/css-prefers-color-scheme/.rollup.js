import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isBrowser = String(process.env.NODE_ENV).includes('browser');
const isBrowserMin = String(process.env.NODE_ENV).includes('browser:min');
const isPostCSS = String(process.env.NODE_ENV).includes('postcss');

// support IE9+ browsers, otherwise node 6+
const targets = isBrowser ? 'ie >= 9' : { node: 8 };

// read from src/browser.js for browsers/node, src/postcss.js for postcss
const input = isPostCSS ? 'src/postcss.js' : 'src/browser.js';

// write to browser.js/browser.min.js for browsers, index.js/index.mjs for node
const output = isPostCSS
  ? [
		{ file: 'postcss.js', format: 'cjs', sourcemap: true, strict: false },
    { file: 'postcss.mjs', format: 'esm', sourcemap: true, strict: false }
] : isBrowser
	? { file: `browser${isBrowserMin ? '.min' : ''}.js`, format: 'iife', name: 'initPrefersColorScheme', sourcemap: !isBrowserMin }
: [
	{ file: 'index.js', format: 'cjs', sourcemap: true },
	{ file: 'index.mjs', format: 'esm', sourcemap: true }
];

// use babel, and also terser to minify browser.min.js
const plugins = [
	babel({
		presets: [
			['@babel/env', { modules: false, targets }]
		]
	})
].concat(
	isBrowserMin
		? terser({
			mangle: true
		})
	: []
);

export default { input, output, plugins };
