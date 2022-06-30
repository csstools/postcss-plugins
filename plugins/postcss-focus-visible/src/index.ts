import parser from 'postcss-selector-parser';
import type { PluginCreator } from 'postcss';

type pluginOptions = { preserve?: boolean, replaceWith?: string };

const POLYFILL_READY_CLASSNAME = '.js-focus-visible';
const PSEUDO = ':focus-visible';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: false,
			replaceWith: '.focus-visible',
		},
		// Provided options
		opts,
	);
	const replacementAST = parser().astSync(options.replaceWith);

	return {
		postcssPlugin: 'postcss-focus-visible',
		Rule(rule, { result }) {
			if (!rule.selector.includes(PSEUDO)) {
				return;
			}

			const selectors = rule.selectors.map((selector) => {
				if (!selector.includes(PSEUDO)) {
					return selector;
				}

				let selectorAST;

				try {
					selectorAST = parser().astSync(selector);
				} catch (_) {
					rule.warn(result, `Failed to parse selector : ${selector}`);
					return selector;
				}

				if (typeof selectorAST === 'undefined') {
					return selector;
				}

				let containsPseudo = false;
				selectorAST.walkPseudos((pseudo) => {
					if (pseudo.value !== PSEUDO) {
						return;
					}

					if (pseudo.nodes && pseudo.nodes.length) {
						return;
					}

					containsPseudo = true;
					pseudo.replaceWith(replacementAST.clone({}));
				});

				if (!containsPseudo) {
					return selector;
				}

				let newSelector = selectorAST.toString();

				if (newSelector.startsWith('html')) {
					newSelector = newSelector.replace('html', `html${POLYFILL_READY_CLASSNAME}`);
				} else {
					newSelector = `${POLYFILL_READY_CLASSNAME} ${newSelector}`;
				}

				return newSelector;
			});

			if (selectors.join(',') === rule.selectors.join(',')) {
				return;
			}

			rule.cloneBefore({ selectors: selectors });

			if (!options.preserve) {
				rule.remove();
			}
		},
	};
};

creator.postcss = true;

export default creator;

