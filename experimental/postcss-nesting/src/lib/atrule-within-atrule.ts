import type { AtRule } from 'postcss';
import cleanupParent from './cleanup-parent.js';
import mergeParams from './merge-params.js';
import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import validAtrules from './valid-atrules.js';

export default function transformAtruleWithinAtrule(node: AtRule, parent: AtRule) {
	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// update the params of the node to be merged with the parent
	node.params = mergeParams(parent.params, node.params);

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}

export function isAtruleWithinAtrule(node: AtRule, parent: AtRule) {
	return validAtrules.includes(node.name) &&
		node.name === parent.name;
}
