import transformRuleWithinRule, { isRuleWithinRule } from './rule-within-rule.js'
import transformNestRuleWithinRule, { isNestRuleWithinRule } from './nest-rule-within-rule.js'
import transformAtruleWithinRule, { isAtruleWithinRule } from './atrule-within-rule.js'
import transformAtruleWithinAtrule, { isAtruleWithinAtrule } from './atrule-within-atrule.js'

export default function walk(node) {
	node.each((child) => {
		if (isRuleWithinRule(child)) {
			transformRuleWithinRule(child)
		} else if (isNestRuleWithinRule(child)) {
			transformNestRuleWithinRule(child, walk)
		} else if (isAtruleWithinRule(child)) {
			transformAtruleWithinRule(child, walk)
		} else if (isAtruleWithinAtrule(child)) {
			transformAtruleWithinAtrule(child)
		}

		if (Object(child.nodes).length) {
			walk(child)
		}
	})
}
