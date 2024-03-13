import type { Node, NodeSource } from 'postcss-selector-parser';

export function sourceFrom(node: Node): { sourceIndex: number; source: NodeSource|undefined }{
	return {
		sourceIndex: node.sourceIndex ?? 0,
		source: node.source,
	};
}
