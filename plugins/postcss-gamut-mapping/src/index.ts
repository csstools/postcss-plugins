import type { AtRule, Container, Declaration, Node, Plugin, PluginCreator } from 'postcss';
import { hasConditionalAncestor } from './has-conditional-ancestor';
import { tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { SyntaxFlag, color, colorDataFitsDisplayP3_Gamut, colorDataFitsRGB_Gamut, serializeRGB } from '@csstools/css-color-parser';
import { sameProperty } from './same-property';

/** postcss-gamut-mapping plugin options */
export type pluginOptions = never;

const HAS_WIDE_GAMUT_COLOR_FUNCTION_REGEX = /\b(?:color|lab|lch|oklab|oklch)\(/i;
const HAS_WIDE_GAMUT_COLOR_NAME_REGEX = /^(?:color|lab|lch|oklab|oklch)$/i;

type State = {
	conditionalRules: Array<AtRule>,
	propNames: Set<string>,
	lastConditionParams: {
		media: string | undefined,
	},
	lastConditionalRule: Container | undefined,
}

type Modification = {
	isRec2020: boolean,
	matchesOriginal: boolean,
	modifiedValue: string,
	hasFallback: boolean,
	item: Declaration,
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

						const declList = sameProperty(decl);

						const maybeModified: Array<Modification> = declList.map((item, index) => {
							visited.add(item);

							let isRec2020 = false;

							const originalValue = item.value;
							const modified = replaceComponentValues(
								parseCommaSeparatedListOfComponentValues(tokenize({ css: originalValue })),
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

						modified.forEach(({ isRec2020, modifiedValue, hasFallback, item }) => {
							const parent = item.parent;
							if (!parent) {
								return;
							}

							const state = states.get(parent) || {
								conditionalRules: [],
								propNames: new Set<string>(),
								lastConditionParams: {
									media: undefined,
								},
								lastConditionalRule: undefined,
							};

							states.set(parent, state);

							const condition = `(color-gamut: ${isRec2020 ? 'rec2020' : 'p3'})`;

							if (state.lastConditionParams.media !== condition) {
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

							const parentClone = parent.clone();
							parentClone.removeAll();

							parentClone.raws.before = '\n';

							const clone = item.clone();

							parentClone.append(clone);
							item.remove();

							visited.add(clone);

							state.lastConditionParams.media = atRule.params;
							state.lastConditionalRule = parentClone;

							atRule.append(parentClone);
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
