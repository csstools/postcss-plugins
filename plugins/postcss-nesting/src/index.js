import walk from './lib/walk.js'

export default function postcssNesting() {
	return {
		postcssPlugin: 'postcss-nesting',
		Once(root) {
			walk(root)
		},
	}
}

postcssNesting.postcss = true
