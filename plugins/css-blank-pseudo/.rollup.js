import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isBrowser = String(process.env.NODE_ENV).includes('browser');
const isLegacy = String(process.env.NODE_ENV).includes('legacy');
const isCLI = String(process.env.NODE_ENV).includes('cli');
const isPostCSS = String(process.env.NODE_ENV).includes('postcss');
const targets = isCLI || isPostCSS || !isBrowser ? { node: 8 } : 'last 2 versions, not dead';

const input = `src/${isCLI ? 'cli' : isPostCSS ? 'postcss' : isLegacy ? 'browser-legacy' : 'browser'}.js`;
const output = isCLI
	? { file: 'cli.js', format: 'cjs', sourcemap: true, strict: false }
: isBrowser && isLegacy
	? { file: 'browser-legacy.js', format: 'cjs', sourcemap: true, strict: false }
: isBrowser
	? { file: 'browser.js', format: 'cjs', sourcemap: true, strict: false }
: isPostCSS
	? [
	{ file: 'postcss.js', format: 'cjs', sourcemap: true },
	{ file: 'postcss.mjs', format: 'esm', sourcemap: true }
] : isLegacy
	? [
	{ file: 'legacy.js', format: 'cjs', sourcemap: true },
	{ file: 'legacy.mjs', format: 'esm', sourcemap: true }
] : [
	{ file: 'index.js', format: 'cjs', sourcemap: true },
	{ file: 'index.mjs', format: 'esm', sourcemap: true }
];
const plugins = [
	babel({
		presets: [
			['@babel/env', { targets }]
		]
	})
].concat(isBrowser
	? [
		trimContentForBrowser(),
		terser()
	]
: isCLI
	? [
		trimContentForBrowser(),
		addHashBang()
	]
: []);

export default { input, output, plugins };

function addHashBang () {
	return {
		name: 'add-hash-bang',
		renderChunk (code) {
			const updatedCode = `#!/usr/bin/env node\n\n${code}`;

			return updatedCode;
		}
	};
}

function trimContentForBrowser () {
	return {
		name: 'trim-content-for-browser',
		renderChunk (code) {
			const updatedCode = code
				.replace(/'use strict';\n*/, '')
				.replace(/\n*module\.exports = cssBlankPseudo;/, '');

			return updatedCode;
		}
	};
}
