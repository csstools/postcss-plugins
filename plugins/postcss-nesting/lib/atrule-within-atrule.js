import shiftNodesBeforeParent from './shift-nodes-before-parent';
import mergeParams from './merge-params';
import cleanupParent from './cleanup-parent';

/*
 * DEPRECATED: In v7.0.0 these features will be removed as they are not part of
 * the nesting proposal.
 */

export default function transformAtruleWithinAtrule(node) {
	// move previous siblings and the node to before the parent
	const parent = shiftNodesBeforeParent(node);

	// update the params of the node to be merged with the parent
	node.params = mergeParams(parent.params, node.params);

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}

import validAtrules from './valid-atrules';

export const isAtruleWithinAtrule = node => node.type === 'atrule' && validAtrules.includes(node.name) && Object(node.parent).type === 'atrule' && node.name === node.parent.name;
