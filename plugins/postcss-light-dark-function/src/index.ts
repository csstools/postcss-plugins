import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { AtRule, Container, Plugin, PluginCreator, Rule } from 'postcss';
import { LIGHT_PROP, OFF, ON, toggleNameGenerator } from './props';
import { colorSchemes } from './color-schemes';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { transformLightDark } from './transform-light-dark';
import { newNestedRuleWithSupportsNot } from './nested-rule';

const COLOR_SCHEME_REGEX = /^color-scheme$/i;
const LIGHT_DARK_FUNCTION_REGEX = /\blight-dark\(/i;

const basePlugin: PluginCreator<pluginOptions> = (opts) => {
	return {
		postcssPlugin: 'postcss-light-dark-function',
		prepare(): Plugin {
			let counter = 0;
			const currentToggleNameGenerator = (): string => {
				return toggleNameGenerator(counter++);
			};

			const variableInheritanceRules: Map<Container, { rule: Rule, supports: AtRule }> = new Map();

			return {
				postcssPlugin: 'postcss-light-dark-function',
				Declaration(decl, { atRule, rule }): void {
					const parent = decl.parent;
					if (!parent) {
						return;
					}

					if (COLOR_SCHEME_REGEX.test(decl.prop)) {
						if (parent.some((sibling) => sibling.type === 'decl' && sibling.prop === LIGHT_PROP)) {
							return;
						}

						const [light, dark] = colorSchemes(decl.value);

						if (light && dark) {
							decl.cloneBefore({ prop: LIGHT_PROP, value: ON });

							const parentClone = parent.clone();
							parentClone.removeAll();

							parentClone.append(decl.clone({ prop: LIGHT_PROP, value: OFF }));

							const prefers = atRule({ name: 'media', params: '(prefers-color-scheme: dark)', source: parent.source });
							prefers.append(parentClone);

							parent.after(prefers);

							return;
						}

						if (dark) {
							decl.cloneBefore({ prop: LIGHT_PROP, value: OFF });

							return;
						}

						if (light) {
							decl.cloneBefore({ prop: LIGHT_PROP, value: ON });

							return;
						}

						return;
					}

					if (LIGHT_DARK_FUNCTION_REGEX.test(decl.value)) {
						if (hasFallback(decl)) {
							return;
						}

						if (hasSupportsAtRuleAncestor(decl, LIGHT_DARK_FUNCTION_REGEX)) {
							return;
						}

						const modified = transformLightDark(decl.value, currentToggleNameGenerator);
						if (modified.value === decl.value) {
							return;
						}

						for (const [toggleName, toggle] of modified.toggles) {
							decl.cloneBefore({ prop: toggleName, value: toggle });
						}

						decl.cloneBefore({ value: modified.value });

						if (decl.variable && decl.parent) {
							const variableInheritanceRule = variableInheritanceRules.get(decl.parent) ?? newNestedRuleWithSupportsNot(
								decl,
								rule,
								atRule
							);

							for (const [toggleName, toggle] of modified.toggles) {
								variableInheritanceRule.rule.append(decl.clone({ prop: toggleName, value: toggle }));
							}

							variableInheritanceRule.rule.append(decl.clone({ value: modified.value }));

							if (!variableInheritanceRules.has(decl.parent)) {
								decl.parent.append(variableInheritanceRule.supports);
								variableInheritanceRules.set(decl.parent, variableInheritanceRule);
							}
						}

						if (!opts?.preserve) {
							decl.remove();
						}
					}
				},
			};
		},
	};
};

basePlugin.postcss = true;

/** postcss-light-dark-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/* Transform the light-dark() function in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-light-dark-function',
			plugins: [
				postcssProgressiveCustomProperties(),
				basePlugin(options),
			],
		};
	}

	return basePlugin(options);
};

postcssPlugin.postcss = true;

export default postcssPlugin;
