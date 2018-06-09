import shiftNodesBeforeParent from './shift-nodes-before-parent';
import cleanupParent from './cleanup-parent';
import validAtrules from './valid-atrules';
import walk from './walk';

/*
 * DEPRECATED: In v7.0.0 these features will be removed as they are not part of
 * the nesting proposal.
 */

export default function atruleWithinRule(node) {
	// move previous siblings and the node to before the parent
	const parent = shiftNodesBeforeParent(node);

	// clone the parent as a new rule with children appended to it
	const rule = parent.clone().removeAll().append(node.nodes);

	// append the new rule to the node
	node.append(rule);

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);

	// walk the children of the new rule
	walk(rule);
}

export const isAtruleWithinRule = node => node.type === 'atrule' && validAtrules.includes(node.name) && Object(node.parent).type === 'rule';
