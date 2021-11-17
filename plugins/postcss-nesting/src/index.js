import walk from './lib/walk.js'

/**
 * @returns {import('postcss').Plugin}
 */
export default function postcssNesting() {
	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule) {
			walk(rule)
		},
	}
}

postcssNesting.postcss = true
