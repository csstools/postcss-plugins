import type { Declaration, Container } from 'postcss';

/**
 * Per container, whether the declaration at each index has a fallback.
 *
 * `hasFallback` is called once per matching declaration. Checking every
 * declaration independently (`parent.index(node)` + a sibling scan) is O(n) per
 * call, which makes a rule with many declarations O(n^2). The answer for every
 * declaration in a container is computed in a single pass and reused until the
 * container's node list changes.
 */
type FallbackIndex = {
	nodeCount: number,
	fallbackAtIndex: Array<boolean>,
};

const fallbackIndexCache = new WeakMap<Container, FallbackIndex>();

function fallbackIndexFor(parent: Container): FallbackIndex {
	const nodes = parent.nodes || [];

	const cached = fallbackIndexCache.get(parent);
	if (cached && cached.nodeCount === nodes.length) {
		return cached;
	}

	const fallbackAtIndex: Array<boolean> = [];
	for (let i = 0; i < nodes.length; i++) {
		fallbackAtIndex.push(false);
	}
	const seenProps = new Set<string>();

	for (let i = 0; i < nodes.length; i++) {
		const sibling = nodes[i];
		if (sibling.type !== 'decl') {
			continue;
		}

		const prop = sibling.prop.toLowerCase();
		if (seenProps.has(prop)) {
			fallbackAtIndex[i] = true;
		} else {
			seenProps.add(prop);
		}
	}

	const index = { nodeCount: nodes.length, fallbackAtIndex };
	fallbackIndexCache.set(parent, index);

	return index;
}

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

	const nodeIndex = parent.index(node);
	if (nodeIndex < 0) {
		return false;
	}

	return fallbackIndexFor(parent).fallbackAtIndex[nodeIndex] === true;
}
