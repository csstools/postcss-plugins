import type { AtRule, Container, Node, Plugin, PluginCreator } from 'postcss';
import { hasConditionalAncestor } from './has-conditional-ancestor';
import { tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { SyntaxFlag, color, colorDataFitsDisplayP3_Gamut, colorDataFitsRGB_Gamut, serializeRGB } from '@csstools/css-color-parser';
import { hasOverrideOrFallback } from './has-override-decl';

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

const creator: PluginCreator<pluginOptions> = () => {

	return {
		postcssPlugin: 'postcss-gamut-mapping',
		prepare(): Plugin {
			const states = new WeakMap<Node, State>();

			return {
				postcssPlugin: 'postcss-gamut-mapping',
				OnceExit(root, { postcss }): void {
					root.walkDecls((decl) => {
						const originalValue = decl.value;
						if (!HAS_WIDE_GAMUT_COLOR_FUNCTION_REGEX.test(originalValue)) {
							return;
						}

						if (!decl.parent || hasConditionalAncestor(decl)) {
							return;
						}

						const { hasOverride, hasFallback } = hasOverrideOrFallback(decl);
						if (hasOverride) {
							return;
						}

						const state = states.get(decl.parent) || {
							conditionalRules: [],
							propNames: new Set<string>(),
							lastConditionParams: {
								media: undefined,
							},
							lastConditionalRule: undefined,
						};

						states.set(decl.parent, state);

						let isRec2020 = false;

						const replacedRGB = replaceComponentValues(
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

						const modifiedRGB = stringify(replacedRGB);
						if (modifiedRGB === originalValue) {
							return;
						}

						const condition = `(color-gamut: ${isRec2020 ? 'rec2020' : 'p3'})`;

						if (state.lastConditionParams.media !== condition) {
							state.lastConditionalRule = undefined;
						}

						if (state.lastConditionalRule) {
							if (!hasFallback) {
								decl.cloneBefore({
									value: modifiedRGB,
								});
							}

							state.lastConditionalRule.append(decl.clone());

							decl.remove();
							return;
						}

						if (!hasFallback) {
							decl.cloneBefore({
								value: modifiedRGB,
							});
						}

						const atRule = postcss.atRule({
							name: 'media',
							params: condition,
							source: decl.parent.source,
							raws: {
								before: '\n\n',
								after: '\n',
							},
						});

						const parentClone = decl.parent.clone();
						parentClone.removeAll();

						parentClone.raws.before = '\n';

						parentClone.append(decl.clone());
						decl.remove();

						state.lastConditionParams.media = atRule.params;
						state.lastConditionalRule = parentClone;

						atRule.append(parentClone);
						state.conditionalRules.push(atRule);
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
