import shiftNodesBeforeParent from './shift-nodes-before-parent';
import cleanupParent from './cleanup-parent';
import mergeSelectors from './merge-selectors';
import validSelector from './valid-selector';

export default function transformRuleWithinRule(node) {
	// move previous siblings and the node to before the parent
	const parent = shiftNodesBeforeParent(node);

	// update the selectors of the node to be merged with the parent
	node.selectors = mergeSelectors(parent.selectors, node.selectors);

	// merge similar rules back together
	// eslint-disable-next-line no-extra-parens
	const areSameRule = (
		node.type === 'rule' && parent.type === 'rule' && node.selector === parent.selector ||
		node.type === 'atrule' && parent.type === 'atrule' && node.params === parent.params
	);

	if (areSameRule) {
		node.append(...parent.nodes);
	}

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}

export const isRuleWithinRule = node => node.type === 'rule' && Object(node.parent).type === 'rule' && node.selectors.every(
	selector => selector.trim().lastIndexOf('&') === 0 && validSelector.test(selector)
);
