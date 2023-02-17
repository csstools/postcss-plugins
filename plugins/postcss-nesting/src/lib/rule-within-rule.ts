import shiftNodesBeforeParent from './shift-nodes-before-parent.js';
import cleanupParent from './cleanup-parent.js';
import mergeSelectors from './merge-selectors/merge-selectors.js';
import type { Result, Rule } from 'postcss';
import { options } from './options.js';
import groupDeclarations from './group-declarations.js';

export default function transformRuleWithinRule(node: Rule, parent: Rule, result: Result, opts: options) {
	let selectors = [];

	// update the selectors of the node to be merged with the parent
	try {
		selectors = mergeSelectors(node, result, parent.selectors, node.selectors, opts, false);
	} catch (err) {
		node.warn(result, `Failed to parse selectors : "${parent.selector}" / "${node.selector}" with message: "${err.message}"`);
		return;
	}

	if (!selectors.length) {
		return;
	}

	// Group all declarations after the first one.
	groupDeclarations(parent);

	// move previous siblings and the node to before the parent
	shiftNodesBeforeParent(node, parent);

	// update the selectors of the node to be merged with the parent
	node.selectors = selectors;

	// merge similar rules back together
	const areSameRule = (node.type === 'rule' && parent.type === 'rule' && node.selector === parent.selector);

	if (areSameRule) {
		node.append(...parent.nodes);
	}

	// conditionally cleanup an empty parent rule
	cleanupParent(parent);
}

export function isValidRuleWithinRule(node: Rule) {
	return node.selectors.every((selector) => {
		return selector.indexOf('|') === -1;
	});
}
