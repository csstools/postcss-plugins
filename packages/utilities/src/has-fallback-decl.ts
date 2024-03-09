import type { Declaration } from 'postcss';

/**
 * Check if a declaration has a fallback.
 * Returns true if a declaration with the same property name appears before the current declaration.
 *
 * @param {Declaration} node The declaration node to check
 * @returns {boolean} Whether the declaration has a fallback
 */
export function hasFallback(node: Declaration): boolean {
	const parent = node.parent;
	if (!parent) {
		return false;
	}

	const nodeProp = node.prop.toLowerCase();

	const currentNodeIndex = parent.index(node);
	for (let i = 0; i < currentNodeIndex; i++) {
		const precedingSibling = parent.nodes[i];
		if (precedingSibling.type === 'decl' && precedingSibling.prop.toLowerCase() === nodeProp) {
			return true;
		}
	}

	return false;
}
