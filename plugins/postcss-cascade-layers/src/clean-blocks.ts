import type { ChildNode, Container, Document } from 'postcss';
import { CONDITIONAL_ATRULES } from './constants';

export function removeEmptyDescendantBlocks(block: Container) {
	block.walk((node) => {
		if (node.type === 'rule' || (node.type === 'atrule' && ['layer', ...CONDITIONAL_ATRULES].includes(node.name.toLowerCase()))) {
			if (node.nodes?.length === 0) {
				node.remove();
			}
		}
	});

	if (block.nodes?.length === 0) {
		block.remove();
	}
}

export function removeEmptyAncestorBlocks(block: Container) {
	let currentNode: Document | Container<ChildNode> = block;

	while (currentNode) {
		if (typeof currentNode.nodes === 'undefined') {
			return;
		}

		if (currentNode.nodes.length > 0) {
			return;
		}

		const parent = currentNode.parent;
		currentNode.remove();
		currentNode = parent;
	}
}
