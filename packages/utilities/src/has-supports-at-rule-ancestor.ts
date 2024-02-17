import type { Node, AtRule } from 'postcss';

/**
 * Check if a node has a `@supports` at-rule ancestor with a given regex in its params.
 *
 * @param {Node} node The node to check
 * @param {{ test(str: string): boolean }} predicate The test to match against the `@supports` at-rule's params
 * @returns {boolean}
 */
export function hasSupportsAtRuleAncestor(node: Node, predicate: { test(str: string): boolean }): boolean {
	let parent = node.parent;
	while (parent) {
		if (
			parent.type !== 'atrule' ||
			(parent as AtRule).name.toLowerCase() !== 'supports'
		) {
			parent = parent.parent;
			continue;
		}

		if (predicate.test((parent as AtRule).params)) {
			return true;
		}

		parent = parent.parent;
	}

	return false;
}
