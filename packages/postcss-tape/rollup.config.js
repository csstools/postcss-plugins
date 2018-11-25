import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/cli.js',
	output: { file: 'index.js', format: 'cjs' },
	plugins: [
		babel({
			plugins: [ '@babel/syntax-dynamic-import' ],
			presets: [ ['@babel/env', { targets: { node: 6 } }] ]
		}),
		terser(),
		trimUseStrict(),
		addHashBang()
	]
};

function addHashBang() {
	return {
		name: 'add-hash-bang',
		renderChunk(code) {
			return `#!/usr/bin/env node\n${code}`;
		}
	};
}

function trimUseStrict() {
	return {
		name: 'trim-use-strict',
		renderChunk(code) {
			return code.replace(/\s*('|")?use strict\1;\s*/, '');
		}
	};
}
