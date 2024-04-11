import type { FunctionNode, Node, WordNode } from 'postcss-value-parser';

export function parseVarFunction(node: FunctionNode): {name: WordNode, fallback?: Array<Node> } | void {
	let name: WordNode | undefined;
	let comma: boolean = false;
	let fallback: Array<Node> | undefined;

	for (const child of node.nodes) {
		if (!name && child.type === 'word') {
			name = child;
			continue;
		}

		if (name && !comma && child.type === 'div' && child.value === ',') {
			comma = true;
			fallback = [];
			continue;
		}

		if (comma && Array.isArray(fallback)) {
			fallback.push(child);
			continue;
		}

		if (child.type === 'space' || (child.type === 'div' && child.value.trim() === '')) {
			continue;
		}

		return;
	}

	if (!name) {
		return;
	}

	return {name: name, fallback};
}
