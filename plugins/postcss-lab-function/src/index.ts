import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, PluginCreator } from 'postcss';
import { color, colorDataFitsRGB_Gamut, serializeP3, serializeRGB, SyntaxFlag } from '@csstools/css-color-parser';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

type basePluginOptions = {
	preserve: boolean,
	subFeatures: {
		displayP3: boolean
	}
};

const LAB_LCH_FUNCTION_REGEX = /\b(?:lab|lch)\(/i;
const LAB_LCH_NAME_REGEX = /^(?:lab|lch)$/i;

/** Transform lab() and lch() functions in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-lab-function',
		Declaration(decl: Declaration): void {
			const originalValue = decl.value;
			if (!(LAB_LCH_FUNCTION_REGEX.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, LAB_LCH_FUNCTION_REGEX)) {
				return;
			}

			const tokens = tokenize({ css: originalValue });
			const replacedRGB = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokens),
				(componentValue) => {
					if (!isFunctionNode(componentValue) || !LAB_LCH_NAME_REGEX.test(componentValue.getName())) {
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

					return serializeRGB(colorData);
				},
			);

			const modifiedRGB = stringify(replacedRGB);
			if (modifiedRGB === originalValue) {
				return;
			}

			let modifiedP3 = modifiedRGB;
			if (opts?.subFeatures.displayP3) {
				modifiedP3 = stringify(replaceComponentValues(
					parseCommaSeparatedListOfComponentValues(tokens),
					(componentValue) => {
						if (!isFunctionNode(componentValue) || !LAB_LCH_NAME_REGEX.test(componentValue.getName())) {
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

						if (colorDataFitsRGB_Gamut(colorData)) {
							return serializeRGB(colorData);
						}

						return serializeP3(colorData);
					},
				));
			}

			decl.cloneBefore({ value: modifiedRGB });

			if (opts?.subFeatures.displayP3 && modifiedP3 !== modifiedRGB) {
				decl.cloneBefore({ value: modifiedP3 });
			}

			if (!opts?.preserve) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

/** postcss-lab-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
	/** Toggle sub features. default: { displayP3: true } */
	subFeatures?: {
		/** Enable displayP3 fallbacks. default: true */
		displayP3?: boolean
	}
};

/** Transform lab() and lch() functions in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: false,
		subFeatures: {
			displayP3: true,
		},
	}, opts);

	// deep merge
	options.subFeatures = Object.assign({
		displayP3: true,
	}, options.subFeatures);

	if (options.enableProgressiveCustomProperties && (options.preserve || options.subFeatures.displayP3)) {
		return {
			postcssPlugin: 'postcss-lab-function',
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
export { postcssPlugin as 'module.exports' };
