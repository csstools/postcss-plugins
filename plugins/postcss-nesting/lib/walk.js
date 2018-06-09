import transformRuleWithinRule, { isRuleWithinRule} from './rule-within-rule';
import transformNestRuleWithinRule, { isNestRuleWithinRule } from './nest-rule-within-rule';
import transformAtruleWithinRule, { isAtruleWithinRule } from './atrule-within-rule';
import transformAtruleWithinAtrule, { isAtruleWithinAtrule } from './atrule-within-atrule';

export default function walk(node) {
	node.nodes.slice(0).forEach(child => {
		if (child.parent === node) {
			if (isRuleWithinRule(child)) {
				transformRuleWithinRule(child);
			} else if (isNestRuleWithinRule(child)) {
				transformNestRuleWithinRule(child);
			} else if (isAtruleWithinRule(child)) {
				transformAtruleWithinRule(child);
			} else if (isAtruleWithinAtrule(child)) {
				transformAtruleWithinAtrule(child);
			}

			if (Object(child.nodes).length) {
				walk(child);
			}
		}
	});
}
