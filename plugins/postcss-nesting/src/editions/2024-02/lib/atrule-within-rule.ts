import cleanupParent from './cleanup-parent.js';
import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import validAtrules from './valid-atrules.js';
import { walkFunc } from './walk-func.js';
import type { AtRule, Result, Rule } from 'postcss';
import mergeSelectors from './merge-selectors.js';

export default function atruleWithinRule(node: AtRule, parent: Rule, result: Result, walk: walkFunc) {
	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// clone the parent as a new rule with children appended to it
	if (node.nodes) {
		const rule = parent.clone().removeAll().append(node.nodes);

		const selectors = mergeSelectors(node, '&', parent.selector, result);
		if (!selectors) {
			return;
		}

		rule.selector = selectors;

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

export function isAtruleWithinRule(node: AtRule) {
	return validAtrules.includes(node.name);
}
