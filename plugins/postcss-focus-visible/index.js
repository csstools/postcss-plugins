import postcss from 'postcss';

const focusVisibleSelectorRegExp = /:focus-visible([^\w-]|$)/gi;

export default postcss.plugin('postcss-focus-visible', opts => {
	const replaceWith = String(Object(opts).replaceWith || '.focus-visible');

	return root => {
		root.walkRules(focusVisibleSelectorRegExp, rule => {
			rule.selector = rule.selector.replace(focusVisibleSelectorRegExp, ($0, $1) => {
				return `${replaceWith}${$1}`;
			});
		});
	};
});
