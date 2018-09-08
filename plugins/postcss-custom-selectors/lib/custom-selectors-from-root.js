import getASTFromSelectors from './selectors-ast-from-selectors-string';

// return custom selectors from the css root, conditionally removing them
export default (root, opts) => {
	// initialize custom selectors
	const customSelectors = {};

	// for each custom selector atrule that is a child of the css root
	root.nodes.slice().forEach(node => {
		if (isCustomSelector(node)) {
			// extract the name and selectors from the params of the custom selector
			const [, name, selectors] = node.params.match(customSelectorParamsRegExp);

			// write the parsed selectors to the custom selector
			customSelectors[name] = getASTFromSelectors(selectors);

			// conditionally remove the custom selector atrule
			if (!Object(opts).preserve) {
				node.remove();
			}
		}
	});

	return customSelectors;
};

// match the custom selector name
const customSelectorNameRegExp = /^custom-selector$/i;

// match the custom selector params
const customSelectorParamsRegExp = /^(:--[A-z][\w-]*)\s+([\W\w]+)\s*$/;

// whether the atrule is a custom selector
const isCustomSelector = node => node.type === 'atrule' && customSelectorNameRegExp.test(node.name) && customSelectorParamsRegExp.test(node.params);
