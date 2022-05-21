export default function transformValueAST(root, customProperties) {
	if (root.nodes && root.nodes.length) {
		root.nodes.slice().forEach((child) => {
			if (isVarFunction(child)) {
				const [propertyNode, ...fallbacks] = child.nodes.filter((node) => node.type !== 'div');
				const { value: name } = propertyNode;
				const index = root.nodes.indexOf(child);

				if (customProperties.has(name)) {
					// Direct match of a custom property to a parsed value
					const nodes = customProperties.get(name).nodes;

					// Re-transform nested properties without given one to avoid circular from keeping this forever
					reTransformValueAST({ nodes }, customProperties, name);

					if (index > -1) {
						root.nodes.splice(index, 1, ...nodes);
					}
				} else if (fallbacks.length) {
					// No match, but fallback available
					if (index > -1) {
						root.nodes.splice(index, 1, ...child.nodes.slice(child.nodes.indexOf(fallbacks[0])));
					}

					transformValueAST(root, customProperties);
				}
			} else {
				// Transform child nodes of current child
				transformValueAST(child, customProperties);
			}
		});
	}

	return root.toString();
}

// reTransform the current ast without a custom property (to prevent recursion)
function reTransformValueAST(root, customProperties, withoutProperty) {
	const nextCustomProperties = new Map(customProperties);

	nextCustomProperties.delete(withoutProperty);

	return transformValueAST(root, nextCustomProperties);
}

// match var() functions
const varRegExp = /^var$/i;

// whether the node is a var() function
const isVarFunction = node => node.type === 'function' && varRegExp.test(node.value) && Object(node.nodes).length > 0;
