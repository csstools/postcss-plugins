import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, PluginCreator } from 'postcss';
import { color, serializeRGB, serializeHSL, SyntaxFlag, ColorNotation } from '@csstools/css-color-parser';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

type basePluginOptions = {
	preserve: boolean,
};

const RGB_HSL_NAME_REGEX = /^(?:rgb|hsl)a?$/i;
const RGB_HSL_FUNCTION_REGEX = /\b(?:rgb|hsl)a?\(/i;

/** Transform the color functional notation in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-color-functional-notation',
		Declaration(decl: Declaration): void {
			const originalValue = decl.value;
			if (!(RGB_HSL_FUNCTION_REGEX.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, RGB_HSL_FUNCTION_REGEX)) {
				return;
			}

			const replacedRGB = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({ css: originalValue })),
				(componentValue) => {
					if (!isFunctionNode(componentValue) || !RGB_HSL_NAME_REGEX.test(componentValue.getName())) {
						return;
					}

					const colorData = color(componentValue);
					if (!colorData) {
						return;
					}

					if (
						colorData.syntaxFlags.has(SyntaxFlag.Experimental) ||
						colorData.syntaxFlags.has(SyntaxFlag.HasNoneKeywords) ||
						colorData.syntaxFlags.has(SyntaxFlag.RelativeColorSyntax)
					) {
						return;
					}

					// Any modern `rgb()` or `hsl()`
					// Or any legacy `rgb()` or `hsl()` with percentage alpha
					if (
						(
							colorData.syntaxFlags.has(SyntaxFlag.LegacyRGB) ||
								colorData.syntaxFlags.has(SyntaxFlag.LegacyHSL)
						) &&
							!colorData.syntaxFlags.has(SyntaxFlag.HasPercentageAlpha)
					) {
						return;
					}

					if (colorData.colorNotation === ColorNotation.HSL) {
						return serializeHSL(colorData);
					}

					return serializeRGB(colorData);
				},
			);

			const modifiedValue = stringify(replacedRGB);
			if (modifiedValue === originalValue) {
				return;
			}

			decl.cloneBefore({ value: modifiedValue });

			if (!opts?.preserve) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

/** postcss-color-functional-notation plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/** Transform the color functional notation in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: false,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-color-functional-notation',
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
