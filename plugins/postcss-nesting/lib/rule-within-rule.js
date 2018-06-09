import shiftNodesBeforeParent from './shift-nodes-before-parent';
import cleanupParent from './cleanup-parent';
import mergeSelectors from './merge-selectors';
import validSelector from './valid-selector';

export default function transformRuleWithinRule(node) {
	// move previous siblings and the node to before the parent
	const parent = shiftNodesBeforeParent(node);

	// update the selectors of the node to be merged with the parent
	node.selectors = mergeSelectors(parent.selectors, node.selectors);

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}

export const isRuleWithinRule = node => node.type === 'rule' && Object(node.parent).type === 'rule' && node.selectors.every(
	selector => selector.trim().lastIndexOf('&') === 0 && validSelector.test(selector)
);
