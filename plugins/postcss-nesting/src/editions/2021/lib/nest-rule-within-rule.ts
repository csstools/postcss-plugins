import type { AtRule, Result, Rule } from 'postcss';
import type { walkFunc } from './walk-func.js';
import mergeSelectors from './merge-selectors/merge-selectors.js';
import shiftNodesBeforeParent from '../../shared/lib/shift-nodes-before-parent.js';
import { comma } from './list.js';
import { options } from './options.js';
import cleanupParent from '../../shared/lib/cleanup-parent.js';

export default function transformNestRuleWithinRule(node: AtRule, parent: Rule, result: Result, walk: walkFunc, opts: options): void {
	let selectors = [];

	try {
		selectors = mergeSelectors(parent.selectors, comma(node.params), opts);
	} catch (err) {
		node.warn(result, `Failed to parse selectors : "${parent.selector}" / "${node.params}" with message: "${(err instanceof Error) ? err.message: err}"`);
		return;
	}

	if (!selectors.length) {
		return;
	}

	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// clone the parent as a new rule with children appended to it
	const rule = parent.clone().removeAll().append(node.nodes);
	rule.raws.semicolon = true; /* nested rules end with "}" and do not have this flag set */

	// update the selectors of the node to be merged with the parent
	rule.selectors = selectors;

	// replace the node with the new rule
	node.replaceWith(rule);

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);

	// walk the children of the new rule
	walk(rule, result, opts);
}

export function isValidNestRuleWithinRule(node: AtRule): boolean {
	return comma(node.params).every((selector) => {
		return selector.split('&').length >= 2 &&
			selector.indexOf('|') === -1;
	});
}
