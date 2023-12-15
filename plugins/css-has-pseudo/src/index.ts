import encodeCSS from './encode/encode.mjs';
import parser from 'postcss-selector-parser';
import type { AtRule, ChildNode, Container, Document, PluginCreator, Rule } from 'postcss';
import { isGuardedByAtSupportsFromAtRuleParams } from './is-guarded-by-at-supports.js';
import { selectorSpecificity } from '@csstools/selector-specificity';

/** css-has-pseudo plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Change the selector that is used to adjust specificity. default: "does-not-exist" */
	specificityMatchingName?: string
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = {
		preserve: true,
		specificityMatchingName: 'does-not-exist',
		...(opts || {}),
	};

	const specificityMatchingNameId = ':not(#' + options.specificityMatchingName + ')';
	const specificityMatchingNameClass = ':not(.' + options.specificityMatchingName + ')';
	const specificityMatchingNameTag = ':not(' + options.specificityMatchingName + ')';

	return {
		postcssPlugin: 'css-has-pseudo',
		prepare() {
			const transformedNodes = new WeakSet();

			return {
				RuleExit: (rule, { result }) => {
					if (transformedNodes.has(rule)) {
						return;
					}

					if (!rule.selector.toLowerCase().includes(':has(') || isWithinSupportCheck(rule)) {
						return;
					}

					const selectors = rule.selectors.map((selector) => {
						if (!selector.toLowerCase().includes(':has(')) {
							return selector;
						}

						let selectorAST;
						try {
							selectorAST = parser().astSync(selector);
						} catch (err) {
							rule.warn(result, `Failed to parse selector : "${selector}" with message: "${(err instanceof Error) ? err.message : err}"`);
							return selector;
						}

						if (typeof selectorAST === 'undefined') {
							return selector;
						}

						selectorAST.walkPseudos((node) => {
							let parent = node.parent;
							let insideHasPseudoClass = false;
							while (parent) {
								if (parser.isPseudoClass(parent) && parent.value.toLowerCase() === ':has') {
									insideHasPseudoClass = true;
								}

								parent = parent.parent;
							}

							if (!insideHasPseudoClass) {
								return;
							}

							// see : https://bugs.chromium.org/p/chromium/issues/detail?id=669058#c34
							// When we have ':has(:visited) {...}', the subject elements of the rule
							// are the ancestors of the visited link element.

							// To prevent leaking visitedness to the link's ancestors, the ':visited'
							// selector does not match if it is inside the ':has()' argument selector.
							// So if a ':has()' argument selector requires a matching ':visited', the
							// style rule are not applied.
							if (node.value.toLowerCase() === ':visited') {
								// We can't leave `:has` untouched as that might cause broken selector lists.
								// Replacing with the specificity matching name as this should never match anything without `:not()`.
								node.replaceWith(parser.className({
									value: options.specificityMatchingName,
								}));
							}

							if (node.value.toLowerCase() === ':any-link') {
								// we can transform `:any-link` to `:link` as this is allowed
								node.value = ':link';
							}
						});

						selectorAST.walkPseudos((node) => {
							if (node.value.toLowerCase() !== ':has' || !node.nodes) {
								return;
							}

							const container = node.parent;
							if (!container) {
								return;
							}

							const hasContainingSelector = parser.selector({
								value: '',
								nodes: [],
							});

							// Split the selector at the pseudo element boundary
							// - :has(...)::before  ->  :has(...) | ::before
							// - :has(...) ~ span::before  ->  :has(...) ~ span | ::before
							{
								let sliceIndex = container.nodes.length;

								PSEUDO_ELEMENT_LOOP:
								for (let i = 0; i < container.nodes.length; i++) {
									const element = container.nodes[i];

									if (parser.isPseudoElement(element)) {
										for (let j = i - 1; j >= 0; j--) {
											if (container.nodes[i].type === 'combinator' || container.nodes[i].type === 'comment') {
												continue;
											}

											sliceIndex = j + 1;
											break PSEUDO_ELEMENT_LOOP;
										}
									}
								}

								const aNodes = container.nodes.slice(0, sliceIndex);
								aNodes.forEach((x) => {
									x.remove();

									if (x.type === 'selector') {
										x.nodes.forEach((y) => {
											delete y.parent;
											// @ts-expect-error https://github.com/postcss/postcss-selector-parser/pull/284
											hasContainingSelector.append(y);
										});
									} else {
										delete x.parent;
										// @ts-expect-error https://github.com/postcss/postcss-selector-parser/pull/284
										hasContainingSelector.append(x);
									}
								});
							}

							const encodedSelector = '[' + encodeCSS(hasContainingSelector.toString()) + ']';
							const abcSpecificity = selectorSpecificity(hasContainingSelector);

							let encodedSelectorWithSpecificity = encodedSelector;
							for (let i = 0; i < abcSpecificity.a; i++) {
								encodedSelectorWithSpecificity += specificityMatchingNameId;
							}
							const bSpecificity = Math.max(1, abcSpecificity.b) - 1;
							for (let i = 0; i < bSpecificity; i++) {
								encodedSelectorWithSpecificity += specificityMatchingNameClass;
							}
							for (let i = 0; i < abcSpecificity.c; i++) {
								encodedSelectorWithSpecificity += specificityMatchingNameTag;
							}

							const encodedSelectorAST = parser().astSync(encodedSelectorWithSpecificity);

							const replacementNodes = encodedSelectorAST.nodes[0].nodes;

							for (let i = replacementNodes.length - 1; i >= 0; i--) {
								// @ts-expect-error https://github.com/postcss/postcss-selector-parser/pull/284
								container.prepend(replacementNodes[i]);
							}
						});

						const modifiedSelector = selectorAST.toString();
						if (modifiedSelector !== selector) {
							return '.js-has-pseudo ' + modifiedSelector;
						}

						return selector;
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

function isWithinSupportCheck(rule: Rule) {
	let ruleParent: Container<ChildNode> | Document | undefined = rule.parent;

	while (ruleParent) {
		if (
			ruleParent.type === 'atrule' &&
			isGuardedByAtSupportsFromAtRuleParams((ruleParent as AtRule).params)
		) {
			return true;
		}

		ruleParent = ruleParent.parent;
	}

	return false;
}
