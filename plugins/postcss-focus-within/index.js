import postcss from 'postcss';

const selectorRegExp = /:focus-within([^\w-]|$)/gi;

export default postcss.plugin('postcss-focus-within', opts => {
	const replaceWith = String(Object(opts).replaceWith || '[focus-within]');

	return root => {
		root.walkRules(selectorRegExp, rule => {
			rule.selector = rule.selector.replace(selectorRegExp, ($0, $1) => {
				return `${replaceWith}${$1}`;
			});
		});
	};
});
