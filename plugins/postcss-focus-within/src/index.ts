import parser from 'postcss-selector-parser';
import type { PluginCreator } from 'postcss';

const selectorRegExp = /(?<!\\):focus-within([^\w-]|$)/gi;

const creator: PluginCreator<{ preserve?: boolean, replaceWith?: string }> = (opts?: { preserve?: boolean, replaceWith?: string }) => {
	const replaceWith = String(Object(opts).replaceWith || '[focus-within]');
	const preserve = Boolean('preserve' in Object(opts) ? opts.preserve : true);
	const replacementAST = parser().astSync(replaceWith);

	return {
		postcssPlugin: 'postcss-focus-within',
		Rule: (rule)=> {
			if (!selectorRegExp.test(rule.selector)) {
				return;
			}

			const modifiedSelectorAST = parser((selectors) => {
				selectors.walkPseudos((pseudo) => {
					if (pseudo.value !== ':focus-within') {
						return;
					}

					pseudo.replaceWith(replacementAST.clone({}));
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

