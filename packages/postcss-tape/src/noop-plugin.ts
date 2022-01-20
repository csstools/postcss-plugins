const noopPlugin = () => {
	return {
		postcssPlugin: 'noop-plugin',
		Rule() {
			// do nothing
		},
	};
};

noopPlugin.postcss = true;

export default noopPlugin;
