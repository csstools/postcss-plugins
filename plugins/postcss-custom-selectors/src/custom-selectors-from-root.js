import parser from 'postcss-selector-parser';

// return custom selectors from the css root, conditionally removing them
export default (root, opts) => {
	// initialize custom selectors
	const customSelectors = {};

	// for each custom selector atrule that is a child of the css root
	root.nodes.slice().forEach(node => {
		if (node.type !== 'atrule' || node.name !== 'custom-selector') {
			return;
		}

		if (!node.params || !node.params.includes(':--')) {
			return;
		}

		const source = node.params.trim();

		const selectorAST = parser().astSync(source);
		const nameNode = selectorAST?.nodes?.[0]?.nodes?.[0];
		if (!nameNode || nameNode.type !== 'pseudo' || !nameNode.value.startsWith(':--')) {
			return;
		}

		const name = nameNode.toString();

		// re-parsing is important to obtain the correct AST shape
		customSelectors[name] = parser().astSync(source.slice(name.length).trim());

		// conditionally remove the custom selector atrule
		if (!Object(opts).preserve) {
			node.remove();
		}
	});

	return customSelectors;
};
