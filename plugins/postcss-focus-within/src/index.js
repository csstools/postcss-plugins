const selectorRegExp = /(?<!\\):focus-within([^\w-]|$)/gi;

const plugin = opts => {
	const replaceWith = String(Object(opts).replaceWith || '[focus-within]');
	const preserve = Boolean('preserve' in Object(opts) ? opts.preserve : true);

	return {
		postcssPlugin: 'postcss-focus-within',
		Rule: rule => {
			if (!selectorRegExp.test(rule.selector)) {
				return;
			}

			const selector = rule.selector.replace(selectorRegExp, ($0, $1) => `${replaceWith}${$1}`);

			// Check is the rule is processed yet
			if (preserve && rule.prev()?.selector === selector) {
				return;
			}

			const clone = rule.clone({ selector });

			if (preserve) {
				rule.before(clone);
			} else {
				rule.replaceWith(clone);
			}
		}
	}
};

plugin.postcss = true;

export default plugin;
