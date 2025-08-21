import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, PluginCreator } from 'postcss';
import { tokenize } from '@csstools/css-tokenizer';
import { color, ColorNotation, serializeP3, SyntaxFlag } from '@csstools/css-color-parser';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';

type basePluginOptions = {
	preserve: boolean,
}

const DISPLAY_P3_LINEAR_REGEX = /\bdisplay-p3-linear\b/i;
const COLOR_NAME_REGEX = /^color$/i;

/** Transform the display-p3-linear color space in the color() function in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-color-function-display-p3-linear',
		Declaration(decl: Declaration): void {
			const originalValue = decl.value;
			if (!(DISPLAY_P3_LINEAR_REGEX.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, DISPLAY_P3_LINEAR_REGEX)) {
				return;
			}

			const tokens = tokenize({ css: originalValue });
			const replacedRGB = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokens),
				(componentValue) => {
					if (!isFunctionNode(componentValue) || !COLOR_NAME_REGEX.test(componentValue.getName())) {
						return;
					}

					const colorData = color(componentValue);
					if (!colorData) {
						return;
					}

					if (colorData.colorNotation !== ColorNotation.Linear_Display_P3) {
						return;
					}

					if (
						colorData.syntaxFlags.has(SyntaxFlag.Experimental) ||
						colorData.syntaxFlags.has(SyntaxFlag.HasNoneKeywords)
					) {
						return;
					}

					return serializeP3(colorData);
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
};

basePlugin.postcss = true;

/** postcss-color-function-display-p3-linear plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/** Transform the display-p3-linear color space in the color() function in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: false,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-color-function-display-p3-linear',
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
