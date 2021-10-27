import walk from './lib/walk.js'

export default function postcssNesting() {
	return {
		postcssPlugin: 'postcss-nesting',
		RuleExit(rule) {
			walk(rule)
		},
	}
}

postcssNesting.postcss = true
