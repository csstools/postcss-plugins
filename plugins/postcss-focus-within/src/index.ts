import parser from 'postcss-selector-parser';
import type { PluginCreator } from 'postcss';

const creator: PluginCreator<{ preserve?: boolean, replaceWith?: string }> = (opts?: { preserve?: boolean, replaceWith?: string }) => {
	const replaceWith = String(Object(opts).replaceWith || '[focus-within]');
	const preserve = Boolean('preserve' in Object(opts) ? opts.preserve : true);
	const replacementAST = parser().astSync(replaceWith);

	return {
		postcssPlugin: 'postcss-focus-within',
		Rule: (rule, { result })=> {
			if (!rule.selector.includes(':focus-within')) {
				return;
			}

			let modifiedSelector;

			try {
				const modifiedSelectorAST = parser((selectors) => {
					selectors.walkPseudos((pseudo) => {
						if (pseudo.value !== ':focus-within') {
							return;
						}

						if (pseudo.nodes && pseudo.nodes.length) {
							return;
						}

						pseudo.replaceWith(replacementAST.clone({}));
					});
				}).processSync(rule.selector);

				modifiedSelector = String(modifiedSelectorAST);
			} catch (_) {
				rule.warn(result, `Failed to parse selector : ${rule.selector}`);
				return;
			}

			if (typeof modifiedSelector === 'undefined') {
				return;
			}

			if (modifiedSelector === rule.selector) {
				return;
			}

			const clone = rule.clone({ selector: modifiedSelector });

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

