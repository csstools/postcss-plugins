// https://github.com/postcss/postcss/issues/1869
const noopPlugin = () => {
	return {
		postcssPlugin: 'noop-plugin',
		Once() {
			// do nothing
		},
	};
};

noopPlugin.postcss = true;

export default noopPlugin;
