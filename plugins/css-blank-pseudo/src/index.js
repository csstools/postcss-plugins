import parser from 'postcss-selector-parser';

const creator = opts => {
	const replaceWith = String(Object(opts).replaceWith || '[blank]');
	const replacementAST = parser().astSync(replaceWith);

	const preserve = Boolean('preserve' in Object(opts) ? opts.preserve : true);

	return {
		postcssPlugin: 'css-blank-pseudo',
		Rule: (rule, { result }) => {
			if (rule.selector.indexOf(':blank') === -1) {
				return;
			}

			let modifiedSelector;
			try {
				const modifiedSelectorAST = parser((selectors) => {
					selectors.walkPseudos((selector) => {
						if (selector.value !== ':blank') {
							return;
						}

						if (selector.nodes && selector.nodes.length) {
							// `:blank` is not a function
							return;
						}

						selector.replaceWith(replacementAST.clone());
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
