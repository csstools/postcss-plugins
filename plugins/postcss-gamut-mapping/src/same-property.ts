import type { Declaration } from 'postcss';

export function sameProperty(node: Declaration): Array<Declaration> {
	const nodeProp = node.prop.toLowerCase();

	const list : Array<Declaration> = [];

	const nodes = node.parent?.nodes ?? [];
	for (let i = 0; i < nodes.length; i++) {
		const sibling = nodes[i];

		if (sibling.type === 'decl' && sibling.prop.toLowerCase() === nodeProp) {
			list.push(sibling);
		}
	}

	return list;
}
