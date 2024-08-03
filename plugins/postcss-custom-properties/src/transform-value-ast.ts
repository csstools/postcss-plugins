import type { Node } from 'postcss-value-parser';
import valuesParser from 'postcss-value-parser';

import { isVarFunction } from './is-var-function';
import { parseVarFunction } from './parse-var-function';

export default function transformValueAST(root: valuesParser.ParsedValue, customProperties: Map<string, valuesParser.ParsedValue>): string {
	if (!root.nodes?.length) {
		return '';
	}

	walk(root.nodes, (child, index, nodes) => {
		if (!isVarFunction(child)) {
			return;
		}

		const parsed = parseVarFunction(child);
		if (!parsed) {
			return;
		}

		let fallbackContainsUnknownVariables = false;
		if (parsed.fallback) {
			valuesParser.walk(parsed.fallback, (childNodeInFallback) => {
				if (!isVarFunction(childNodeInFallback)) {
					return;
				}

				const parsedFallback = parseVarFunction(childNodeInFallback);
				if (!parsedFallback) {
					return;
				}

				if (
					!parsedFallback.fallback &&
					!customProperties.has(parsedFallback.name.value)
				) {
					fallbackContainsUnknownVariables = true;
					return false;
				}
			});
		}

		let resolvedNodes = customProperties.get(parsed.name.value)?.nodes;
		if (!resolvedNodes && parsed.fallback && !fallbackContainsUnknownVariables) {
			// No match, but fallback available
			resolvedNodes = parsed.fallback;
		}

		if (typeof resolvedNodes === 'undefined') {
			return;
		}

		if (resolvedNodes.length) {
			nodes.splice(index, 1, ...resolvedNodes);
		} else {
			// `postcss-value-parser` throws when removing nodes.
			// Inserting an empty comment produces equivalent CSS source code and avoids the exception.
			nodes.splice(index, 1, {
				type: 'div',
				value: ' ',
				before: '',
				after: '',
				sourceIndex: child.sourceIndex,
				sourceEndIndex: child.sourceEndIndex,
			});
		}
	});

	return valuesParser.stringify(root.nodes);
}

function walk(nodes: Array<Node>, cb: valuesParser.WalkCallback): void {
	let i, max, node, result;

	for (i = 0, max = nodes.length; i < max; i += 1) {
		node = nodes[i];

		if (
			result !== false &&
			node.type === 'function' &&
			Array.isArray(node.nodes)
		) {
			walk(node.nodes, cb);
		}

		cb(node, i, nodes);
		max = nodes.length;
	}
}
