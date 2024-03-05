import type { Result, Rule } from 'postcss';
import cleanupParent from '../../shared/lib/cleanup-parent.js';
import mergeSelectors from './merge-selectors.js';
import shiftNodesBeforeParent from '../../shared/lib/shift-nodes-before-parent.js';

export default function transformRuleWithinRule(node: Rule, parent: Rule, result: Result) {
	const selectors = mergeSelectors(node, node.selector, parent.selector, result);
	if (!selectors) {
		return;
	}

	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// update the selectors of the node to be merged with the parent
	node.selector = selectors;

	// merge similar rules back together
	const areSameRule = (node.type === 'rule' && parent.type === 'rule' && node.selector === parent.selector);

	if (areSameRule) {
		node.append(...parent.nodes);
	}

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}

export function isValidRuleWithinRule(node: Rule) {
	return node.selectors.every((selector) => {
		return selector.indexOf('|') === -1;
	});
}
