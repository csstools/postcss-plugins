export default function transformValueAST(root, customProperties) {
	if (root.nodes && root.nodes.length) {
		root.nodes.slice().forEach((child) => {
			if (isVarFunction(child)) {
				const [propertyNode, ...fallbacks] = child.nodes.filter((node) => node.type !== 'div');
				const { value: name } = propertyNode;
				const index = root.nodes.indexOf(child);

				if (name in Object(customProperties)) {
					// Direct match of a custom property to a parsed value
					const nodes = customProperties[name].nodes;

					// Re-transform nested properties without given one to avoid circular from keeping this forever
					retransformValueAST({ nodes }, customProperties, name);

					if (index > -1) {
						root.nodes.splice(index, 1, ...nodes);
					}
				} else if (fallbacks.length) {
					// No match, but fallback available
					if (index > -1) {
						root.nodes.splice(index, 1, ...fallbacks);
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

// retransform the current ast without a custom property (to prevent recursion)
function retransformValueAST(root, customProperties, withoutProperty) {
	const nextCustomProperties = Object.assign({}, customProperties);

	delete nextCustomProperties[withoutProperty];

	return transformValueAST(root, nextCustomProperties);
}

// match var() functions
const varRegExp = /^var$/i;

// whether the node is a var() function
const isVarFunction = node => node.type === 'function' && varRegExp.test(node.value) && Object(node.nodes).length > 0;
