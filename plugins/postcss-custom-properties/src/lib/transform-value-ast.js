export default function transformValueAST(root, customProperties) {
	if (root.nodes && root.nodes.length) {
		root.nodes.slice().forEach(child => {
			if (isVarFunction(child)) {
				// eslint-disable-next-line no-unused-vars
				const [propertyNode, comma, ...fallbacks] = child.nodes;
				const { value: name } = propertyNode;

				if (name in Object(customProperties)) {
					// conditionally replace a known custom property
					const nodes = asClonedArrayWithBeforeSpacing(customProperties[name], child.raws.before);

					/**
					 * https://github.com/postcss/postcss-custom-properties/issues/221
					 * https://github.com/postcss/postcss-custom-properties/issues/218
					 *
					 * replaceWith loses node.raws values, so we need to save it and restore
					 */
					const raws = nodes.map(node => ({...node.raws}));

					child.replaceWith(...nodes);

					nodes.forEach((node, index) => {
						node.raws = raws[index];
					});

					retransformValueAST({ nodes }, customProperties, name);
				} else if (fallbacks.length) {
					// conditionally replace a custom property with a fallback
					const index = root.nodes.indexOf(child);

					if (index !== -1) {
						root.nodes.splice(index, 1, ...asClonedArrayWithBeforeSpacing(fallbacks, child.raws.before));
					}

					transformValueAST(root, customProperties);
				}
			} else {
				transformValueAST(child, customProperties);
			}
		});
	}

	return root;
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
const isVarFunction = node => node.type === 'func' && varRegExp.test(node.name) && Object(node.nodes).length > 0;

// return an array with its nodes cloned, preserving the raw
const asClonedArrayWithBeforeSpacing = (array, beforeSpacing) => {
	const clonedArray = asClonedArray(array, null);

	if (clonedArray[0]) {
		clonedArray[0].raws.before = beforeSpacing;
	}

	return clonedArray;
};

// return an array with its nodes cloned
const asClonedArray = (array, parent) => array.map(node => asClonedNode(node, parent));

// return a cloned node
const asClonedNode = (node, parent) => {
	const cloneNode = new node.constructor(node);

	for (const key in node) {
		if (key === 'parent') {
			cloneNode.parent = parent;
		} else if (Object(node[key]).constructor === Array) {
			cloneNode[key] = asClonedArray(node.nodes, cloneNode);
		} else if (Object(node[key]).constructor === Object) {
			cloneNode[key] = Object.assign({}, node[key]);
		}
	}

	return cloneNode;
};
