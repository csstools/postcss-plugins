import type { Declaration } from 'postcss';

export function hasExactFallback(node: Declaration, newValue: string): boolean {
	const parent = node.parent;
	if (!parent) {
		return false;
	}

	const nodeProp = node.prop.toLowerCase();

	const currentNodeIndex = parent.index(node);
	for (let i = currentNodeIndex - 1; i >= 0; i--) {
		const precedingSibling = parent.nodes[i];
		if (precedingSibling.type === 'decl' && precedingSibling.prop.toLowerCase() === nodeProp) {
			if (precedingSibling.value === newValue) {
				return true;
			}

			return false;
		}
	}

	return false;
}
