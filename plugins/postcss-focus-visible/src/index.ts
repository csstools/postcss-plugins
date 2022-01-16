
import parser from 'postcss-selector-parser';
import type { PluginCreator } from 'postcss';

const creator: PluginCreator<{ preserve?: boolean, replaceWith?: string }> = (opts?: { preserve?: boolean, replaceWith?: string }) => {
	opts = Object(opts);
	const preserve = Boolean('preserve' in opts ? opts.preserve : true);
	const replaceWith = String(opts.replaceWith || '.focus-visible');
	const replacementAST = parser().astSync(replaceWith);

	return {
		postcssPlugin: 'postcss-focus-visible',
		Rule(rule, { result }) {
			if (!rule.selector.includes(':focus-visible')) {
				return;
			}

			let modifiedSelector;

			try {
				const modifiedSelectorAST = parser((selectors) => {
					selectors.walkPseudos((pseudo) => {
						if (pseudo.value !== ':focus-visible') {
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
