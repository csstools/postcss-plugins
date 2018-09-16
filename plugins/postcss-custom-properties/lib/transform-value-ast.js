export default function transformValueAST(root, customProperties) {
	if (root.nodes && root.nodes.length) {
		root.nodes.slice().forEach(child => {
			if (isVarFunction(child)) {
				// eslint-disable-next-line no-unused-vars
				const [propertyNode, comma, ...fallbacks] = child.nodes.slice(1, -1);
				const { value: name } = propertyNode;

				if (name in customProperties) {
					// conditionally replace a known custom property
					child.replaceWith(
						...asClonedArray(customProperties[name])
					);

					const nextCustomProperties = Object.assign({}, customProperties);

					delete nextCustomProperties[name];

					transformValueAST(root, nextCustomProperties);
				} else if (fallbacks.length) {
					// conditionally replace a custom property with a fallback
					const clonedFallbacks = asClonedArray(fallbacks);

					Object.assign(clonedFallbacks[0].raws, { before: '' });

					child.replaceWith(...clonedFallbacks);

					const nextCustomProperties = Object.assign({}, customProperties);

					delete nextCustomProperties[name];

					transformValueAST(root, nextCustomProperties);
				}
			} else {
				transformValueAST(child, customProperties);
			}
		})
	}

	return root;
}

// match var() functions
const varRegExp = /^var$/i;

// whether the node is a var() function
const isVarFunction = node => node.type === 'func' && varRegExp.test(node.value) && Object(node.nodes).length > 0;

// return an array with its nodes cloned
const asClonedArray = array => array.map(node => node.clone());
