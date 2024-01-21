import cleanupParent from './cleanup-parent.js';
import groupDeclarations from './group-declarations.js';
import mergeSelectors from './merge-selectors.js';
import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import type { Result, Rule } from 'postcss';

export default function transformRuleWithinRule(node: Rule, parent: Rule, result: Result) {
	const selectors = mergeSelectors(node, node.selector, parent.selector, result);
	if (!selectors) {
		return;
	}

	// Group all declarations after the first one.
	groupDeclarations(parent);

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
