import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import cleanupParent from './cleanup-parent.js';
import mergeSelectors from './merge-selectors.js';

export default function transformRuleWithinRule(node, opts) {
	// move previous siblings and the node to before the parent
	const parent = shiftNodesBeforeParent(node);

	// update the selectors of the node to be merged with the parent
	node.selectors = mergeSelectors(parent.selectors, node.selectors, opts);

	// merge similar rules back together
	const areSameRule = (node.type === 'rule' && parent.type === 'rule' && node.selector === parent.selector) || (node.type === 'atrule' && parent.type === 'atrule' && node.params === parent.params);

	if (areSameRule) {
		node.append(...parent.nodes);
	}

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}

export const isRuleWithinRule = (node) => node.type === 'rule' && Object(node.parent).type === 'rule' && node.selectors.every((selector) => selector.trim().indexOf('&') === 0 && selector.indexOf('|') === -1);
