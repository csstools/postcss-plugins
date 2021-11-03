import ensureCorrectMixingOfNestingRulesAndDeclarations from './lib/mixing-nesting-rules-and-declarations.js'
import walk from './lib/walk.js'

export default function postcssNesting() {
	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule) {
			ensureCorrectMixingOfNestingRulesAndDeclarations(rule)
			walk(rule)
		},
	}
}

postcssNesting.postcss = true
