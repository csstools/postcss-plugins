import parser from 'postcss-selector-parser';
import type { PluginCreator } from 'postcss';
import isValidReplacement from './is-valid-replacement.mjs';

/** postcss-focus-within plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** The replacement class to be used in the polyfill. default: "[focus-within]" */
	replaceWith?: string,
	/** Disable the selector prefix that is used to prevent a flash of incorrectly styled content. default: false */
	disablePolyfillReadyClass?: boolean
};

const POLYFILL_READY_CLASSNAME = 'js-focus-within';
const PSEUDO = ':focus-within';

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign(
		// Default options
		{
			preserve: true,
			replaceWith: '[focus-within]',
			disablePolyfillReadyClass: false,
		},
		// Provided options
		opts,
	);

	const replacementAST = parser().astSync(options.replaceWith);
	if (!isValidReplacement(options.replaceWith)) {
		return {
			postcssPlugin: 'postcss-focus-within',
			Once: (root, { result }) => {
				root.warn(
					result,
					`${options.replaceWith} is not a valid replacement since it can't be applied to single elements.`,
				);
			},
		};
	}

	return {
		postcssPlugin: 'postcss-focus-within',
		prepare() {
			const transformedNodes = new WeakSet();

			return {
				Rule(rule, { result }) {
					if (transformedNodes.has(rule)) {
						return;
					}

					if (!rule.selector.toLowerCase().includes(PSEUDO)) {
						return;
					}

					const selectors = rule.selectors.flatMap((selector) => {
						if (!selector.toLowerCase().includes(PSEUDO)) {
							return [selector];
						}

						let selectorAST;

						try {
							selectorAST = parser().astSync(selector);
						} catch (err) {
							rule.warn(result, `Failed to parse selector : "${selector}" with message: "${(err instanceof Error) ? err.message : err}"`);
							return selector;
						}

						if (typeof selectorAST === 'undefined') {
							return [selector];
						}

						let containsPseudo = false;
						selectorAST.walkPseudos((pseudo) => {
							if (pseudo.value.toLowerCase() !== PSEUDO) {
								return;
							}

							if (pseudo.nodes && pseudo.nodes.length) {
								return;
							}

							containsPseudo = true;
							pseudo.replaceWith(replacementAST.clone({}));
						});

						if (!containsPseudo) {
							return [selector];
						}

						const selectorASTClone = selectorAST.clone();

						// html > .foo:focus-within
						// becomes:
						// html.js-focus-within > .foo:focus-within,
						// .js-focus-within html > .foo:focus-within
						if (!options.disablePolyfillReadyClass) {
							if (selectorAST.nodes?.[0]?.nodes?.length) {
								for (let i = 0; i < selectorAST.nodes[0].nodes.length; i++) {
									const node = selectorAST.nodes[0].nodes[i];
									if (node.type === 'combinator' || parser.isPseudoElement(node)) {
										// Insert the class before the first combinator or pseudo element.
										selectorAST.nodes[0].insertBefore(node, parser.className({ value: POLYFILL_READY_CLASSNAME }));
										break;
									}

									if (i === selectorAST.nodes[0].nodes.length - 1) {
										// Append the class to the end of the selector if not combinator or pseudo element was found.
										// @ts-expect-error https://github.com/postcss/postcss-selector-parser/pull/284
										selectorAST.nodes[0].append(parser.className({ value: POLYFILL_READY_CLASSNAME }));
										break;
									}
								}
							}

							if (selectorAST.nodes?.[0]?.nodes) {
								// Prepend a space combinator and the class to the beginning of the selector.
								// @ts-expect-error https://github.com/postcss/postcss-selector-parser/pull/284
								selectorASTClone.nodes[0].prepend(parser.combinator({ value: ' ' }));
								// @ts-expect-error https://github.com/postcss/postcss-selector-parser/pull/284
								selectorASTClone.nodes[0].prepend(parser.className({ value: POLYFILL_READY_CLASSNAME }));
							}

							return [selectorAST.toString(), selectorASTClone.toString()];
						}

						return [selectorAST.toString()];
					});

					if (selectors.join(',') === rule.selectors.join(',')) {
						return;
					}

					transformedNodes.add(rule);
					rule.cloneBefore({ selectors: selectors });

					if (!options.preserve) {
						rule.remove();
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

