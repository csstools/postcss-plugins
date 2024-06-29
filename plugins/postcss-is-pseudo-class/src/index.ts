import type { Plugin, PluginCreator } from 'postcss';
import alwaysValidSelector from './split-selectors/always-valid';
import complexSelectors from './split-selectors/complex';
import splitSelectors from './split-selectors/split-selectors';

/** postcss-is-pseudo-class plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/**
	 * Warn on complex selectors in `:is` pseudo class functions.
	 * default: _not set_
	*/
	onComplexSelector?: 'warning',
	/**
	 * Warn when pseudo elements are used in `:is` pseudo class functions.
	 * default: _not set_
	*/
	onPseudoElement?: 'warning',
	/**
	 * Change the selector used to adjust specificity.
	 * default: `does-not-exist`.
	 */
	specificityMatchingName?: string
};

const HAS_IS_PSEUDO_REGEX = /:is\(/i;

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = {
		specificityMatchingName: 'does-not-exist',
		...(opts || {}),
	};

	return {
		postcssPlugin: 'postcss-is-pseudo-class',
		prepare(): Plugin {
			const transformedNodes = new WeakSet();

			return {
				postcssPlugin: 'postcss-is-pseudo-class',
				Rule(rule, { result }): void {
					if (!rule.selector) {
						return;
					}

					if (!HAS_IS_PSEUDO_REGEX.test(rule.selector)) {
						return;
					}

					if (transformedNodes.has(rule)) {
						return;
					}

					// Because of loops and recursion we try to only warn once per selector.
					let didWarnForComplexSelectors = false;
					const warnOnComplexSelector = (): void => {
						if (options.onComplexSelector !== 'warning') {
							return;
						}
						if (didWarnForComplexSelectors) {
							return;
						}

						didWarnForComplexSelectors = true;
						rule.warn(result, `Complex selectors in '${rule.selector}' can not be transformed to an equivalent selector without ':is()'.`);
					};

					// Because of loops and recursion we try to only warn once per selector.
					let didWarnForPseudoElements = false;
					const warnOnPseudoElements = (): void => {
						if (options.onPseudoElement !== 'warning') {
							return;
						}
						if (didWarnForPseudoElements) {
							return;
						}

						didWarnForPseudoElements = true;
						rule.warn(result, `Pseudo elements are not allowed in ':is()', unable to transform '${rule.selector}'`);
					};

					try {
						let didModify = false;
						const selectorListOnOriginalNode: Array<string> = [];

						// 1. List behavior.
						const split = splitSelectors(
							rule.selectors,
							{
								specificityMatchingName: options.specificityMatchingName,
							},
						);

						// 2. Complex selectors.
						const resolvedComplexSelectors = complexSelectors(
							split,
							{
								onComplexSelector: options.onComplexSelector,
							},
							warnOnComplexSelector,
							warnOnPseudoElements,
						);

						// 3. Remove duplicates.
						const uniqueResolvedComplexSelectors = Array.from(new Set(resolvedComplexSelectors));

						// 4. Replace.
						uniqueResolvedComplexSelectors.forEach((modifiedSelector) => {
							// `::is()` is incorrect but can't be detected without parsing.
							// It will be left as is and will eventually trigger this condition.
							// This prevents an infinite loop.
							// didModify is the signal to prevent the infinite loop.
							if (rule.selectors.indexOf(modifiedSelector) > -1) {
								selectorListOnOriginalNode.push(modifiedSelector);
								return;
							}

							if (alwaysValidSelector(modifiedSelector)) {
								selectorListOnOriginalNode.push(modifiedSelector);
								didModify = true;
								return;
							}

							transformedNodes.add(rule);
							rule.cloneBefore({ selector: modifiedSelector });
							didModify = true;
						});

						if (selectorListOnOriginalNode.length && didModify) {
							transformedNodes.add(rule);
							rule.cloneBefore({ selectors: selectorListOnOriginalNode });
						}

						if (!options.preserve) {
							if (!didModify) {
								return;
							}

							rule.remove();
						}
					} catch (err) {
						if (!(err instanceof Error)) {
							throw err;
						}

						// Do not ignore infinite recursion errors.
						if (err.message.indexOf('call stack size exceeded') > -1) {
							throw err;
						}

						rule.warn(result, `Failed to parse selector "${rule.selector}" with error: ${err.message}`);
					}
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

