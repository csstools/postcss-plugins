import { list } from 'postcss';
import shiftNodesBeforeParent from './shift-nodes-before-parent';
import cleanupParent from './cleanup-parent';
import mergeSelectors from './merge-selectors';
import validSelector from './valid-selector';
import walk from './walk';

const { comma } = list;

export default function transformNestRuleWithinRule(node) {
	// move previous siblings and the node to before the parent
	const parent = shiftNodesBeforeParent(node);

	// clone the parent as a new rule with children appended to it
	const rule = parent.clone().removeAll().append(node.nodes);

	// replace the node with the new rule
	node.replaceWith(rule);

	// update the selectors of the node to be merged with the parent
	rule.selectors = mergeSelectors(parent.selectors, comma(node.params));

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);

	// walk the children of the new rule
	walk(rule);
}

export const isNestRuleWithinRule = node => node.type === 'atrule' && node.name === 'nest' && Object(node.parent).type === 'rule' && comma(node.params).every(
	selector => selector.split('&').length === 2 && validSelector.test(selector)
);
