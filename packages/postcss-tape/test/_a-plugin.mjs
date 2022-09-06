const aPlugin = (options) => {
	options = {
		selector: '.foo',
		replacement: '.baz',
		warn: false,
		break_sourcemap: false,
		...options,
	};

	return {
		postcssPlugin: 'a-plugin',
		Declaration(decl) {
			if (options.break_sourcemap && decl.value === '1') {
				decl.replaceWith('order: 2');
			}
		},
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
aPlugin.postcssTapeSelfTest = true;

export default aPlugin;
