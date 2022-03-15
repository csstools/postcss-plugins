import type { PluginCreator } from 'postcss';
import { AtMediaOptions, AtSupportsOptions, SelectorOptions, validateOptions, ValueOptions } from './options';
import { onCSSValue, onCSSValueRequiredDesignToken, onCSSValueUnknownDesignToken } from './values';

type pluginOptions = {
	requiresDesignTokens?: {
		properties: Array<string>,
	},
	designTokens?: {
		atMedia?: Array<AtMediaOptions>,
		atSupports?: Array<AtSupportsOptions>,
		selectors?: Array<SelectorOptions>,
		values?: Array<ValueOptions>
	}
};

const creator: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const config = validateOptions(opts);

	return {
		postcssPlugin: 'postcss-design-tokens',
		prepare() {
			return {
				Once(root, { result }) {

					if (config.requiresDesignTokens.properties.size > 0) {
						// Emit warnings for properties that use custom values when not allowed.

						root.walkDecls(decl => {
							if (config.requiresDesignTokens.properties.has(decl.prop)) {
								if (decl.value.indexOf('design-token') === -1) {
									decl.warn(result, `"${decl.prop}" must always use design tokens.`);
									return;
								}

								const modifiedValue = onCSSValueRequiredDesignToken(config, result, decl);
								if (modifiedValue === false || modifiedValue === decl.value) {
									decl.warn(result, `"${decl.prop}" must always use design tokens.`);
									return;
								}

								decl.value = modifiedValue;
							}
						});
					}
				},
				OnceExit(root, { result }) {
					// Emit warnings if design tokens remain after processing.
					root.walkDecls(decl => {
						if (decl.value.indexOf('design-token') === -1) {
							return;
						}

						onCSSValueUnknownDesignToken(config, result, decl);
					});
				},
				Declaration(decl, { result }) {
					if (decl.value.indexOf('design-token') === -1) {
						return;
					}

					const modifiedValue = onCSSValue(config, result, decl);
					if (modifiedValue === decl.value) {
						return;
					}

					decl.value = modifiedValue;
				},
			};
		},
	};
};

creator.postcss = true;

export default creator;

