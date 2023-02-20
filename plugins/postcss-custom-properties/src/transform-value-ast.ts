import valueParser from 'postcss-value-parser';
import type { FunctionNode, Node } from 'postcss-value-parser';
import { isVarFunction } from './is-var-function';

export default function transformValueAST(root: valueParser.ParsedValue, customProperties: Map<string, valueParser.ParsedValue>) {
	if (root.nodes && root.nodes.length) {
		const ancestry: Map<Node, FunctionNode | valueParser.ParsedValue> = new Map();
		root.nodes.forEach((child) => {
			ancestry.set(child, root);
		});

		valueParser.walk(root.nodes, (child) => {
			if (('nodes' in child) && child.nodes.length) {
				child.nodes.forEach((grandChild) => {
					ancestry.set(grandChild, child);
				});
			}
		});

		valueParser.walk(root.nodes, (child) => {
			if (!isVarFunction(child)) {
				return;
			}

			const [propertyNode, ...fallbacks] = child.nodes.filter((x) => x.type !== 'div');
			const { value: name } = propertyNode;

			const parent = ancestry.get(child);
			if (!parent) {
				return;
			}

			const index = parent.nodes.indexOf(child);
			if (index === -1) {
				return;
			}

			let fallbackContainsUnknownVariables = false;
			if (fallbacks) {
				valueParser.walk(fallbacks, (childNodeInFallback) => {
					if (isVarFunction(childNodeInFallback)) {
						const [fallbackPropertyNode] = childNodeInFallback.nodes.filter((x) => x.type === 'word');
						if (customProperties.has(fallbackPropertyNode.value)) {
							return;
						}

						fallbackContainsUnknownVariables = true;
						return false;
					}
				});
			}

			let nodes = [];
			if (customProperties.has(name)) {
				// Direct match of a custom property to a parsed value
				nodes = customProperties.get(name)?.nodes ?? [];
			} else if (fallbacks.length && !fallbackContainsUnknownVariables) {
				// No match, but fallback available
				nodes = child.nodes.slice(child.nodes.indexOf(fallbacks[0]));
			} else {
				return;
			}

			if (nodes.length) {
				parent.nodes.splice(index, 1, ...nodes);
				parent.nodes.forEach((x) => ancestry.set(x, parent));
			} else {
				// `postcss-value-parser` throws when removing nodes.
				// Inserting an empty comment produces equivalent CSS source code and avoids the exception.
				parent.nodes.splice(index, 1, {
					type: 'comment',
					value: '',
					sourceIndex: child.sourceIndex,
					sourceEndIndex: child.sourceEndIndex,
				});
				parent.nodes.forEach((x) => ancestry.set(x, parent));
			}
		}, true);
	}

	return root.toString();
}
