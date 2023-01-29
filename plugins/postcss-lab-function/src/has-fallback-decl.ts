import type { Declaration } from 'postcss';

export function hasFallback(node: Declaration): boolean {
	const parent = node.parent;
	if (!parent) {
		return false;
	}

	const currentNodeIndex = parent.index(node);
	for (let i = 0; i < currentNodeIndex; i++) {
		const precedingSibling = parent.nodes[i];
		if (precedingSibling.type === 'decl' && precedingSibling.prop.toLowerCase() === node.prop.toLowerCase()) {
			return true;
		}
	}

	return false;
}
