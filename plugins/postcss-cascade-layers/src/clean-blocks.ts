import type { ChildNode, Container, Document } from 'postcss';
import { CONDITIONAL_ATRULES } from './constants';

export function removeEmptyDescendantBlocks(block: Container) {
	block.walk((node) => {
		if (node.type === 'rule' || (node.type === 'atrule' && ['layer', ...CONDITIONAL_ATRULES].includes(node.name))) {
			if (!node.nodes || !node.nodes.length) {
				node.remove();
			}
		}
	});

	if (!block.nodes || !block.nodes.length) {
		block.remove();
	}
}

export function removeEmptyAncestorBlocks(block: Container) {
	let currentNode: Document | Container<ChildNode> = block;

	while (currentNode) {
		if (currentNode.nodes && currentNode.nodes.length > 0) {
			return;
		}

		const parent = currentNode.parent;
		currentNode.remove();
		currentNode = parent;
	}
}
