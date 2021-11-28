import { comma } from './list.js';
import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import cleanupParent from './cleanup-parent.js';
import mergeSelectors from './merge-selectors.js';

export default function transformNestRuleWithinRule(node, walk) {
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

export const isNestRuleWithinRule = (node) => node.type === 'atrule' && node.name === 'nest' && Object(node.parent).type === 'rule' && comma(node.params).every((selector) => selector.split('&').length >= 2 && selector.indexOf('|') === -1);
