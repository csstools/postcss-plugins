import type { Result, Rule } from 'postcss';
import cleanupParent from '../../shared/lib/cleanup-parent.js';
import groupDeclarations from './group-declarations.js';
import mergeSelectors from './merge-selectors/merge-selectors.js';
import shiftNodesBeforeParent from '../../shared/lib/shift-nodes-before-parent.js';
import { options } from './options.js';

export default function transformRuleWithinRule(node: Rule, parent: Rule, result: Result, opts: options): void {
	let selectors: Array<string> = [];

	// update the selectors of the node to be merged with the parent
	try {
		selectors = mergeSelectors(parent.selectors, node.selectors, opts);
	} catch (err) {
		node.warn(result, `Failed to parse selectors : "${parent.selector}" / "${node.selector}" with message: "${(err instanceof Error) ? err.message: err}"`);
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

export function isValidRuleWithinRule(node: Rule): boolean {
	return node.selectors.every((selector) => {
		return selector.indexOf('|') === -1;
	});
}
