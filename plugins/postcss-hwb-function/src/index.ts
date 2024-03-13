import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, PluginCreator } from 'postcss';
import { color, serializeRGB, SyntaxFlag } from '@csstools/css-color-parser';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize } from '@csstools/css-tokenizer';

const HWB_FUNCTION_REGEX = /\bhwb\(/i;
const HWB_NAME_REGEX = /^hwb$/i;

/** postcss-hwb-function plugin options */
export type basePluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

/** Transform hwb() functions in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-hwb-function',
		Declaration(decl: Declaration): void {
			const originalValue = decl.value;
			if (!(HWB_FUNCTION_REGEX.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, HWB_FUNCTION_REGEX)) {
				return;
			}

			const replaced = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({ css: originalValue })),
				(componentValue) => {
					if (!isFunctionNode(componentValue) || !HWB_NAME_REGEX.test(componentValue.getName())) {
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

			const modifiedValue = stringify(replaced);
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

/** postcss-hwb-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/** Transform hwb() functions in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: false,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-hwb-function',
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
