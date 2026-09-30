import type { Declaration, Container, Node } from 'postcss';

/**
 * PostCSS passes proxy nodes to plugin visitors. Cache entries and lookups must
 * use the underlying node so that identity comparisons behave the same as they
 * do on the real AST.
 */
function unwrapProxy<T extends Node>(node: T): T {
	return (node as T & { proxyOf?: T }).proxyOf ?? node;
}

/**
 * Per-container set of declarations that have a fallback: a declaration with
 * the same (ASCII lowercased) property name appears before it.
 *
 * `hasFallback` is called once per matching declaration. The naive version
 * (`parent.index(node)` + a sibling scan) is O(n) per call, which makes a rule
 * with many declarations O(n^2). The answer for every declaration in a
 * container is computed in a single pass and reused until the container's node
 * list changes.
 */
type FallbackIndex = {
	nodeCount: number,
	firstNode: unknown,
	lastNode: unknown,
	declarationsWithFallback: WeakSet<Declaration>,
};

const fallbackIndexCache = new WeakMap<Container, FallbackIndex>();

function fallbackIndexFor(parent: Container): FallbackIndex {
	const nodes = parent.nodes || [];

	let index = fallbackIndexCache.get(parent);
	if (
		index &&
		index.nodeCount === nodes.length &&
		index.firstNode === nodes[0] &&
		index.lastNode === nodes[nodes.length - 1]
	) {
		return index;
	}

	const declarationsWithFallback = new WeakSet<Declaration>();
	const seenProps = new Set<string>();

	for (let i = 0; i < nodes.length; i++) {
		const sibling = nodes[i];
		if (sibling.type !== 'decl') {
			continue;
		}

		const decl = sibling;
		const prop = decl.prop.toLowerCase();
		if (seenProps.has(prop)) {
			declarationsWithFallback.add(decl);
		} else {
			seenProps.add(prop);
		}
	}

	index = {
		nodeCount: nodes.length,
		firstNode: nodes[0],
		lastNode: nodes[nodes.length - 1],
		declarationsWithFallback,
	};
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

	return fallbackIndexFor(unwrapProxy(parent)).declarationsWithFallback.has(unwrapProxy(node));
}
