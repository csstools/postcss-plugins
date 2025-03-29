import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Plugin, PluginCreator } from 'postcss';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { tokenize } from '@csstools/css-tokenizer';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { color, serializeRGB, SyntaxFlag } from '@csstools/css-color-parser';

const CONTRAST_COLOR_FUNCTION_REGEX = /\bcontrast-color\(/i;
const CONTRAST_COLOR_NAME_REGEX = /^contrast-color$/i;

const basePlugin: PluginCreator<pluginOptions> = (opts) => {
	return {
		postcssPlugin: 'postcss-contrast-color-function',
		prepare(): Plugin {
			return {
				postcssPlugin: 'postcss-contrast-color-function',
				Declaration(decl): void {
					const originalValue = decl.value;
					if (!(CONTRAST_COLOR_FUNCTION_REGEX.test(originalValue))) {
						return;
					}

					if (hasFallback(decl)) {
						return;
					}

					if (hasSupportsAtRuleAncestor(decl, CONTRAST_COLOR_FUNCTION_REGEX)) {
						return;
					}

					const tokens = tokenize({ css: originalValue });
					const replacedRGB = replaceComponentValues(
						parseCommaSeparatedListOfComponentValues(tokens),
						(componentValue) => {
							if (!isFunctionNode(componentValue) || !CONTRAST_COLOR_NAME_REGEX.test(componentValue.getName())) {
								return;
							}

							const colorData = color(componentValue);
							if (!colorData) {
								return;
							}

							if (colorData.syntaxFlags.has(SyntaxFlag.HasNoneKeywords)) {
								return;
							}

							return serializeRGB(colorData);
						},
					);

					const modified = stringify(replacedRGB);
					if (modified === originalValue) {
						return;
					}

					decl.cloneBefore({ value: modified });

					if (!opts?.preserve) {
						decl.remove();
					}
				},
			};
		},
	};
};

basePlugin.postcss = true;

/** postcss-contrast-color-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/* Transform the contrast-color() function in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-contrast-color-function',
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
