import type { AtRule, ChildNode, Container, Declaration, Document, Node, Plugin, PluginCreator } from 'postcss';
import { hasConditionalAncestor } from './has-conditional-ancestor';
import { hasSupportsConditionAncestor, supportsConditions } from './supports-condition';
import { tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { SyntaxFlag, color, colorDataFitsDisplayP3_Gamut, colorDataFitsRGB_Gamut, serializeRGB } from '@csstools/css-color-parser';
import { sameProperty } from './same-property';

/** postcss-gamut-mapping plugin options */
export type pluginOptions = never;

const HAS_WIDE_GAMUT_COLOR_FUNCTION_REGEX = /\b(?:color|lab|lch|oklab|oklch)\(/i;
const HAS_WIDE_GAMUT_COLOR_NAME_REGEX = /^(?:color|lab|lch|oklab|oklch)$/i;
const IS_PROPERTY_REGEX = /^property$/i;
const IS_KEYFRAMES_REGEX = /^keyframes$/i;
const IS_FUNCTION_REGEX = /^function$/i;

type State = {
	conditionalRules: Array<AtRule>,
	propNames: Set<string>,
	lastConditionParams: string | undefined,
	lastConditionalRule: Container | undefined,
};

type Modification = {
	conditions: Array<string>,
	isRec2020: boolean,
	matchesOriginal: boolean,
	modifiedValue: string,
	hasFallback: boolean,
	item: Declaration,
};

function inKeyframes(decl: Declaration): AtRule | void {
	let parent: typeof decl.parent | Document = decl.parent;
	while (parent) {
		if (parent.type === 'atrule' && IS_KEYFRAMES_REGEX.test(parent.name)) {
			return parent;
		}

		parent = parent.parent;
	}
}

const creator: PluginCreator<pluginOptions> = () => {

	return {
		postcssPlugin: 'postcss-gamut-mapping',
		prepare(): Plugin {
			const states = new WeakMap<Node, State>();
			const visited = new WeakSet<Node>();

			return {
				postcssPlugin: 'postcss-gamut-mapping',
				OnceExit(root, { postcss }): void {
					root.walkDecls((decl) => {
						if (visited.has(decl)) {
							return;
						}

						if (!HAS_WIDE_GAMUT_COLOR_FUNCTION_REGEX.test(decl.value)) {
							return;
						}

						if (!decl.parent || hasConditionalAncestor(decl)) {
							return;
						}

						if (inKeyframes(decl) || decl.parent.type === 'atrule' && IS_PROPERTY_REGEX.test(decl.parent.name)) {
							return;
						}

						const declList = sameProperty(decl);

						const maybeModified: Array<Modification> = declList.map((item, index) => {
							visited.add(item);

							let isRec2020 = false;

							const originalValue = item.value;
							const originalComponentValues = parseCommaSeparatedListOfComponentValues(tokenize({ css: originalValue }));
							const conditions = supportsConditions(originalComponentValues.flat());
							const modified = replaceComponentValues(
								originalComponentValues,
								(componentValue) => {
									if (!isFunctionNode(componentValue) || !HAS_WIDE_GAMUT_COLOR_NAME_REGEX.test(componentValue.getName())) {
										return;
									}

									const colorData = color(componentValue);
									if (!colorData) {
										return;
									}

									if (colorData.syntaxFlags.has(SyntaxFlag.HasNoneKeywords)) {
										return;
									}

									if (colorDataFitsRGB_Gamut(colorData)) {
										return;
									}

									if (!isRec2020 && !colorDataFitsDisplayP3_Gamut(colorData)) {
										isRec2020 = true;
									}

									return serializeRGB(colorData, true);
								},
							);

							const modifiedValue = stringify(modified);

							return {
								conditions: conditions,
								isRec2020: isRec2020,
								matchesOriginal: modifiedValue === originalValue,
								modifiedValue: modifiedValue,
								hasFallback: index > 0,
								item: item,
							};
						});

						const modified: Array<Modification> = [];

						{
							maybeModified.reverse();

							for (const item of maybeModified) {
								if (item.matchesOriginal) {
									break;
								}

								modified.push(item);
							}

							modified.reverse();
						}

						modified.forEach(({ conditions, isRec2020, modifiedValue, hasFallback, item }) => {
							const parent = item.parent;
							if (!parent) {
								return;
							}

							const state = states.get(parent) || {
								conditionalRules: [],
								propNames: new Set<string>(),
								lastConditionParams: undefined,
								lastConditionalRule: undefined,
							};

							states.set(parent, state);

							const condition = `(color-gamut: ${isRec2020 ? 'rec2020' : 'p3'})`;

							const supportsParams = hasSupportsConditionAncestor(item)
								? ''
								: conditions.join(' and ');

							const conditionParams = `${condition} && ${supportsParams}`;

							if (state.lastConditionParams !== conditionParams) {
								state.lastConditionalRule = undefined;
							}

							if (!hasFallback) {
								const clone = item.cloneBefore({
									value: modifiedValue,
								});

								visited.add(clone);
							}

							if (state.lastConditionalRule) {
								const clone = item.clone();
								state.lastConditionalRule.append(clone);

								visited.add(clone);

								item.remove();
								return;
							}

							const atRule = postcss.atRule({
								name: 'media',
								params: condition,
								source: parent.source,
								raws: {
									before: '\n\n',
									after: '\n',
								},
							});

							let conditionalRuleContainer: Container<ChildNode>;

							if (supportsParams) {
								const supportsRule = postcss.atRule({
									name: 'supports',
									params: supportsParams,
									source: parent.source,
									raws: {
										before: '\n\n',
										after: '\n',
									},
								});

								atRule.append(supportsRule);

								if (parent.type === 'atrule' && IS_FUNCTION_REGEX.test(parent.name)) {
									// `@function` accepts conditional group rules in its body,
									// so the conditional rule is nested instead of cloning the `@function`.
									conditionalRuleContainer = supportsRule;
								} else {
									const parentClone = parent.clone();
									parentClone.removeAll();

									parentClone.raws.before = '\n';

									supportsRule.append(parentClone);
									conditionalRuleContainer = parentClone;
								}
							} else if (parent.type === 'atrule' && IS_FUNCTION_REGEX.test(parent.name)) {
								// `@function` accepts conditional group rules in its body,
								// so the conditional rule is nested instead of cloning the `@function`.
								conditionalRuleContainer = atRule;
							} else {
								const parentClone = parent.clone();
								parentClone.removeAll();

								parentClone.raws.before = '\n';

								atRule.append(parentClone);
								conditionalRuleContainer = parentClone;
							}

							const clone = item.clone();

							conditionalRuleContainer.append(clone);
							item.remove();

							visited.add(clone);

							state.lastConditionParams = conditionParams;
							state.lastConditionalRule = conditionalRuleContainer;

							state.conditionalRules.push(atRule);
						});
					});

					root.walk((node) => {
						const state = states.get(node);
						if (!state) {
							return;
						}

						if (state.conditionalRules.length === 0) {
							return;
						}

						if (node.type === 'atrule' && IS_FUNCTION_REGEX.test(node.name)) {
							// Conditional rules belong inside the `@function` body.
							node.append(state.conditionalRules);
							return;
						}

						// rule.after reverses the at rule order.
						// reversing the call order gives in the correct order overall.
						state.conditionalRules.reverse().forEach((atSupports) => {
							node.after(atSupports);
						});
					});
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;
export { creator as 'module.exports' };
