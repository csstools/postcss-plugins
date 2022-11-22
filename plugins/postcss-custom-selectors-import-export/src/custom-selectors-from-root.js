import parser from 'postcss-selector-parser';

// return custom selectors from the css root, conditionally removing them
export default (root) => {
	// initialize custom selectors
	const customSelectors = {};

	// for each custom selector atrule that is a child of the css root
	root.walkAtRules((node) => {
		if (node.name.toLowerCase() !== 'custom-selector') {
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

		customSelectors[name] = source.slice(name.length).trim();
	});

	return customSelectors;
};
