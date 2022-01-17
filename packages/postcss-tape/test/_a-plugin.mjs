const aPlugin = (options) => {
	options = {
		selector: '.foo',
		replacement: '.baz',
		warn: false,
		...options,
	};

	return {
		postcssPlugin: 'a-plugin',
		Rule(rule, { result }) {
			if (rule.selector === options.selector) {
				rule.selector = options.replacement;
			}

			if (options.warn) {
				rule.warn(result, 'a warning');
			}
		},
	};
};

aPlugin.postcss = true;

export default aPlugin;
