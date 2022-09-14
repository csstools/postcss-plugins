import cleanupParent from './cleanup-parent.js';
import { options } from './options.js';
import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import validAtrules from './valid-atrules.js';
import { walkFunc } from './walk-func.js';
import type { AtRule, Rule } from 'postcss';

export default function atruleWithinRule(node: AtRule, parent: Rule, walk: walkFunc, opts: options) {
	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// clone the parent as a new rule with children appended to it
	const rule = parent.clone().removeAll().append(node.nodes);

	// append the new rule to the node
	node.append(rule);

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);

	// walk the children of the new rule
	walk(rule, opts);
}

export function isAtruleWithinRule(node: AtRule) {
	return validAtrules.includes(node.name);
}
