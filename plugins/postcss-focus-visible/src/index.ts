
import parser from 'postcss-selector-parser';
import type { PluginCreator } from 'postcss';

const selectorRegExp = /(?<!\\):focus-visible([^\w-]|$)/gi;

const creator: PluginCreator<{ preserve?: boolean, replaceWith?: string }> = (opts?: { preserve?: boolean, replaceWith?: string }) => {
	opts = Object(opts);
	const preserve = Boolean('preserve' in opts ? opts.preserve : true);
	const replaceWith = String(opts.replaceWith || '.focus-visible');
	const replacementAST = parser().astSync(replaceWith);

	return {
		postcssPlugin: 'postcss-focus-visible',
		Rule(rule) {
			if (!selectorRegExp.test(rule.selector)) {
				return;
			}

			const modifiedSelectorAST = parser((selectors) => {
				selectors.walkPseudos((pseudo) => {
					if (pseudo.value !== ':focus-visible') {
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
