import ensureCorrectMixingOfNestingRulesAndDeclarations from './lib/mixing-nesting-rules-and-declarations.js'
import walk from './lib/walk.js'

/**
 * @param {{allowDeclarationsAfterNestedRules?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
export default function postcssNesting(opts) {
	const allowDeclarationsAfterNestedRules = Object(opts).allowDeclarationsAfterNestedRules || false

	return {
		postcssPlugin: 'postcss-nesting',
		Rule(rule) {
			if (!allowDeclarationsAfterNestedRules) {
				ensureCorrectMixingOfNestingRulesAndDeclarations(rule)
			}
			walk(rule)
		},
	}
}

postcssNesting.postcss = true
