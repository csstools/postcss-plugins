import getFnValue from './get-fn-value';

// update a node with an environment value
export default (node, variables) => {
	// get the value of a css function as a string
	const value = getFnValue(node);

	if (typeof value === 'string' && value in variables) {
		node.replaceWith(
			...asClonedArrayWithBeforeSpacing(variables[value], node.raws.before)
		);
	}
};

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
