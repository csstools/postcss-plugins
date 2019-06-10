import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const isCLI = String(process.env.NODE_ENV).includes('cli');
const isPostCSS = String(process.env.NODE_ENV).includes('postcss');
const isBrowser = String(process.env.NODE_ENV).includes('browser');

const input = `src/${isCLI ? 'cli' : isPostCSS ? 'postcss' : 'browser'}.js`;

const output = isCLI
	? { file: 'cli.js', format: 'cjs', sourcemap: true, strict: false }
: isPostCSS
	? [
	{ file: 'postcss.js', format: 'cjs', sourcemap: true },
	{ file: 'postcss.mjs', format: 'esm', sourcemap: true }
] : isBrowser
	? { file: 'browser.js', format: 'cjs', sourcemap: true, strict: false }
: [
	{ file: 'index.js', format: 'cjs', sourcemap: true },
	{ file: 'index.mjs', format: 'esm', sourcemap: true }
];

const targets = isCLI || isPostCSS || !isBrowser ? { node: 8 } : 'last 2 versions, not dead';
const plugins = [
	babel({
		presets: [
			['@babel/env', { targets }]
		]
	})
].concat(isBrowser
	? [
		trimContentForBrowser(),
		terser({
			mangle: {
				properties: {
					reserved: ['addEventListener', 'addedNodes', 'attributes', 'childList', 'children', 'cloneNode', 'contains', 'createElement', 'cssRules', 'documentElement', 'innerHTML', 'nodeType', 'observe', 'ownerNode', 'parentNode', 'parentStyleSheet', 'querySelector', 'querySelectorAll', 'removeAttribute', 'selectorText', 'setAttributeNode', 'setNamedItem', 'sheet', 'style', 'styleSheets', 'subtree', 'zoom']
				}
			}
		})
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
				.replace(/\n*module\.exports = cssHasPseudo;/, '');

			return updatedCode;
		}
	};
}
