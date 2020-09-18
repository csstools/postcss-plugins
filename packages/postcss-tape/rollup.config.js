import babel from 'rollup-plugin-babel'
import MagicString from 'magic-string'

export default {
	input: 'src/index.js',
	output: {
		file: 'dist/index.js',
		format: 'cjs',
		sourcemap: true,
		strict: true,
	},
	plugins: [
		babel({
			presets: [['@babel/env', { targets: { node: 10 } }]],
		}),
		addHashBang(),
	],
}

function addHashBang() {
	return {
		name: 'add-hash-bang',
		renderChunk(code) {
			const str = new MagicString(code)
			str.prepend(`#!/usr/bin/env node\n`)
			return {
				code: str.toString(),
				map: str.generateMap({ hires: true }),
			}
		},
	}
}
