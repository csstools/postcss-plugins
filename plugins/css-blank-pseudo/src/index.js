import parser from 'postcss-selector-parser';

const selectorRegExp = /:blank([^\w-]|$)/gi;

const creator = opts => {
	const replaceWith = String(Object(opts).replaceWith || '[blank]');
	const replacementAST = parser().astSync(replaceWith);

	const preserve = Boolean('preserve' in Object(opts) ? opts.preserve : true);

	return {
		postcssPlugin: 'css-blank-pseudo',
		Rule: (rule) => {
			if (!selectorRegExp.test(rule.selector)) {
				return;
			}

			const modifiedSelectorAST = parser((selectors) => {
				selectors.walkPseudos((pseudo) => {
					if (pseudo.value !== ':blank') {
						return;
					}

					pseudo.replaceWith(replacementAST.clone());
				});
			}).processSync(rule.selector);

			const clone = rule.clone({ selector: String(modifiedSelectorAST) });

			if (preserve) {
				rule.before(clone);
			} else {
				rule.replaceWith(clone);
			}
		},
	};
};

creator.postcss = true;

export default creator;
