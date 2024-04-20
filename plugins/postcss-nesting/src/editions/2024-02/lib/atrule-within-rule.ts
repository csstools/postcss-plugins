import type { AtRule, Result, Rule } from 'postcss';
import type { walkFunc } from './walk-func.js';
import cleanupParent from '../../shared/lib/cleanup-parent.js';
import shiftNodesBeforeParent from '../../shared/lib/shift-nodes-before-parent.js';
import validAtrules from '../../shared/lib/valid-atrules.js';

export default function atruleWithinRule(node: AtRule, parent: Rule, result: Result, walk: walkFunc): void {
	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// clone the parent as a new rule with children appended to it
	if (node.nodes) {
		const rule = parent.clone().removeAll().append(node.nodes);

		// append the new rule to the node
		node.append(rule);

		// conditionally cleanup an empty parent rule
		cleanupParent(parent);

		// walk the children of the new rule
		walk(rule, result);
	} else {
		// conditionally cleanup an empty parent rule
		cleanupParent(parent);
	}
}

export function isAtruleWithinRule(node: AtRule): boolean {
	return validAtrules.includes(node.name);
}
