const typeCheckerPlugin = () => {
	return {
		postcssPlugin: 'type-checker-plugin',
		OnceExit(root) {
			root.walkAtRules((node) => {
				if (typeof node.params !== 'string') {
					throw node.error(`Params must be of type 'string', found '${typeof node.params}' instead`);
				}

				if (typeof node.type !== 'string') {
					throw node.error(`Type must be of type 'string', found '${typeof node.type}' instead`);
				}

				if (node.type !== 'atrule') {
					throw node.error(`Type must be 'atrule', found '${node.type}' instead`);
				}

				if (typeof node.name !== 'string') {
					throw node.error(`Name must be of type 'string', found '${typeof node.name}' instead`);
				}

				if (node.nodes && !Array.isArray(node.nodes)) {
					throw node.error(`Nodes must be of type 'Array' when it is present, found '${typeof node.nodes}' instead`);
				}

				if (!('parent' in node)) {
					throw node.error('AtRule must have a \'parent\' property');
				}

				if (!('first' in node)) {
					throw node.error('AtRule must have a \'first\' property');
				}

				if (!('last' in node)) {
					throw node.error('AtRule must have a \'last\' property');
				}
			});

			root.walkRules((node) => {
				if (typeof node.selector !== 'string') {
					throw node.error(`Selector must be of type 'string', found '${typeof node.selector}' instead`);
				}

				if (typeof node.type !== 'string') {
					throw node.error(`Type must be of type 'string', found '${typeof node.type}' instead`);
				}

				if (node.type !== 'rule') {
					throw node.error(`Type must be 'rule', found '${node.type}' instead`);
				}

				if (!Array.isArray(node.nodes)) {
					throw node.error(`Nodes must be of type 'Array', found '${typeof node.nodes}' instead`);
				}

				if (!('parent' in node)) {
					throw node.error('Rule must have a \'parent\' property');
				}

				if (!('first' in node)) {
					throw node.error('Rule must have a \'first\' property');
				}

				if (!('last' in node)) {
					throw node.error('Rule must have a \'last\' property');
				}
			});
		},
	};
};

typeCheckerPlugin.postcss = true;

export default typeCheckerPlugin;
