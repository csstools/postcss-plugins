import mediaASTFromString from './media-ast-from-string';

// return custom selectors from the css root, conditionally removing them
export default (root, opts) => {
	// initialize custom selectors
	const customMedias = {};

	// for each custom selector atrule that is a child of the css root
	root.nodes.slice().forEach(node => {
		if (isCustomMedia(node)) {
			// extract the name and selectors from the params of the custom selector
			const [, name, selectors] = node.params.match(customMediaParamsRegExp);

			// write the parsed selectors to the custom selector
			customMedias[name] = mediaASTFromString(selectors);

			// conditionally remove the custom selector atrule
			if (!Object(opts).preserve) {
				node.remove();
			}
		}
	});

	return customMedias;
};

// match the custom selector name
const customMediaNameRegExp = /^custom-media$/i;

// match the custom selector params
const customMediaParamsRegExp = /^(--[A-z][\w-]*)\s+([\W\w]+)\s*$/;

// whether the atrule is a custom selector
const isCustomMedia = node => node.type === 'atrule' && customMediaNameRegExp.test(node.name) && customMediaParamsRegExp.test(node.params);
