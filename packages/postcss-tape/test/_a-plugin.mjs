const aPlugin = (options) => {
	options = {
		selector: '.foo',
		replacement: '.baz',
		...options,
	};

	return {
		postcssPlugin: 'a-plugin',
		Rule(rule) {
			if (rule.selector === options.selector) {
				rule.selector = options.replacement;
			}
		},
	};
};

aPlugin.postcss = true;

export default aPlugin;
