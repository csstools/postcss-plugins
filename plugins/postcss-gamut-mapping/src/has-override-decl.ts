import type { Declaration } from 'postcss';

export function hasOverrideOrFallback(node: Declaration): { hasOverride: boolean, hasFallback: boolean } {
	const nodeProp = node.prop.toLowerCase();

	let hasOverride = false;
	let hasFallback = false;

	const nodes = node.parent?.nodes ?? [];
	const index = nodes.indexOf(node);

	for (let i = 0; i < nodes.length; i++) {
		if (i === index) {
			continue;
		}

		const sibling = nodes[i];
		if (sibling.type === 'decl' && sibling.prop.toLowerCase() === nodeProp) {
			if (i < index) {
				hasFallback = true;
				i = index;
			} else {
				hasOverride = true;
				break;
			}
		}
	}

	return {
		hasOverride,
		hasFallback,
	};
}
