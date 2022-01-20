const aPlugin = (options) => {
	options = {
		selector: '.foo',
		replacement: '.baz',
		warn: false,
		break_sourcemap: false,
		postcss8_3_api_call: false,
		...options,
	};

	return {
		postcssPlugin: 'a-plugin',
		Declaration(decl) {
			if (options.postcss8_3_api_call && decl.value === '1') {
				// This test might need updates in the future if we update PostCSS versions.
				// Check the release logs of PostCSS and pick something else that is new to use.
				// Disabling this test is also fine.
				try {
					decl.assign({ prop: 'order-b', value: '2' });
				} catch (error) {
					// strip stacktrace to ensure the stderr output is the same across multiple machines
					console.error('[TAPE DEBUG] ' + error.message);
				}
			}

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
