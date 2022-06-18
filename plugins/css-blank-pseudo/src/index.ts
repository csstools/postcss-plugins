import type { PluginCreator } from 'postcss';
import parser from 'postcss-selector-parser';
import isValidReplacement from 'src/is-valid-replacement.mjs';

type pluginOptions = { color?: string, preserve?: boolean };

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: true,
			replaceWith: '[blank]',
		},
		// Provided options
		opts,
	);
	const replacementAST = parser().astSync(options.replaceWith);

	if (!isValidReplacement(options.replaceWith)) {
		return {
			postcssPlugin: 'css-blank-pseudo',
			Once: (root, { result }) => {
				root.warn(
					result,
					`${options.replaceWith} is not a valid replacement since it can't be applied to single elements.`,
				);
			},
		};
	}

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

						selector.replaceWith(replacementAST.clone({}));
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

			if (options.preserve) {
				rule.before(clone);
			} else {
				rule.replaceWith(clone);
			}
		},
	};
};

creator.postcss = true;

export default creator;

