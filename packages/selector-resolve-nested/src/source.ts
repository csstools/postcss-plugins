import type { Node } from 'postcss-selector-parser';

export function sourceFrom(node: Node) {
	return {
		sourceIndex: node.sourceIndex ?? 0,
		source: node.source,
	};
}
