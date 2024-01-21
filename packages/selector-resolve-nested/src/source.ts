import type { Node } from 'postcss-selector-parser';

export function sourceFrom(node: Node) {
	return {
		sourceIndex: node.sourceIndex ?? 0,
		source: {
			start: {
				line: node.source?.start?.line ?? 0,
				column: node.source?.start?.column ?? 0,
			},
			end: {
				line: node.source?.end?.line ?? 0,
				column: node.source?.end?.column ?? 0,
			},
		},
	};
}
