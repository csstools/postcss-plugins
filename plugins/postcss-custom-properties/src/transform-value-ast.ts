import type { Node } from 'postcss-value-parser';
import valuesParser from 'postcss-value-parser';

import { isVarFunction } from './is-var-function';
import { parseVarFunction } from './parse-var-function';

/**
 * A budget that limits the total amount of work done while resolving custom properties.
 * Custom properties can reference each other and duplicate subtrees, which can grow
 * exponentially. Sharing a single budget bounds the total expansion.
 */
type TransformValueASTBudget = {
	remaining: number,
};

export const MAX_TRANSFORMED_NODES = 100_000;

// Insert a large number of nodes without spreading them into `splice`.
// The spread operator throws a `RangeError` when the array is larger than
// the engine's argument limit.
function replaceNodeWithNodes(nodes: Array<Node>, index: number, replacement: Array<Node>): void {
	if (replacement.length <= 8192) {
		nodes.splice(index, 1, ...replacement);
		return;
	}

	const rebuilt = nodes.slice(0, index).concat(replacement, nodes.slice(index + 1));

	nodes.length = 0;
	for (let i = 0; i < rebuilt.length; i++) {
		nodes.push(rebuilt[i]);
	}
}

export default function transformValueAST(root: valuesParser.ParsedValue, customProperties: Map<string, valuesParser.ParsedValue>, budget: TransformValueASTBudget = { remaining: MAX_TRANSFORMED_NODES }): string {
	if (!root.nodes?.length) {
		return '';
	}

	walk(root.nodes, (child, index, nodes) => {
		budget.remaining--;
		if (budget.remaining < 0) {
			throw new Error('Maximum custom property expansion size exceeded, reduce the complexity of your custom properties');
		}

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
			replaceNodeWithNodes(nodes, index, resolvedNodes);
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
	let i, max, node;

	for (i = 0, max = nodes.length; i < max; i += 1) {
		node = nodes[i];

		if (
			node.type === 'function' &&
			Array.isArray(node.nodes)
		) {
			walk(node.nodes, cb);
		}

		cb(node, i, nodes);
		max = nodes.length;
	}
}
