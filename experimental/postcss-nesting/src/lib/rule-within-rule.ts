import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import cleanupParent from './cleanup-parent.js';
import mergeSelectors from './merge-selectors/merge-selectors.js';
import type { Result, Rule } from 'postcss';

export default function transformRuleWithinRule(node: Rule, parent: Rule, result: Result) {
	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// update the selectors of the node to be merged with the parent
	node.selectors = mergeSelectors(node, result, parent.selectors, node.selectors);

	// merge similar rules back together
	const areSameRule = (node.type === 'rule' && parent.type === 'rule' && node.selector === parent.selector);

	if (areSameRule) {
		node.append(...parent.nodes);
	}

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}
