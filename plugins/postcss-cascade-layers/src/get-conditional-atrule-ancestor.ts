import type { AtRule, ChildNode, Document, Container } from 'postcss';
import { CONDITIONAL_ATRULES } from './constants';

// Returns the first ancestor of the current layerRule that is a conditional rule;
export function getConditionalAtRuleAncestor(layerRule: AtRule): AtRule | null {
	let parent: Container<ChildNode>|Document = layerRule.parent;
	while (parent) {
		if (parent.type !== 'atrule') {
			parent = parent.parent;
			continue;
		}

		if (CONDITIONAL_ATRULES.includes((parent as AtRule).name.toLowerCase())) {
			return parent as AtRule;
		}

		parent = parent.parent;
	}

	return null;
}
