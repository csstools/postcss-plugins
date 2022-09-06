const aPlugin = (options) => {
	options = {
		property: 'order',
		replacement: 2,
		...options,
	};

	return {
		postcssPlugin: 'b-plugin',
		Declaration(decl) {
			if (decl.prop === options.property && decl.value !== options.replacement) {
				decl.value = options.replacement;
			}
		},
	};
};

aPlugin.postcss = true;
aPlugin.postcssTapeSelfTest = true;

export default aPlugin;
