import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration } from 'postcss';
import type { PluginCreator } from 'postcss';
import { tokenize } from '@csstools/css-tokenizer';
import { color, serializeRGB, SyntaxFlag } from '@csstools/css-color-parser';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';

type basePluginOptions = {
	preserve: boolean,
}

const colorFunctionRegex = /(color)\(/i;
const colorNameRegex = /^(color)$/i;

/* Transform the color() function in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-color-function',
		Declaration: (decl: Declaration) => {
			const originalValue = decl.value;
			if (!(colorFunctionRegex.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const tokens = tokenize({ css: originalValue });
			const replacedRGB = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokens),
				(componentValue) => {
					if (isFunctionNode(componentValue) && colorNameRegex.test(componentValue.getName())) {
						const colorData = color(componentValue);
						if (!colorData) {
							return;
						}

						if (colorData.syntaxFlags.has(SyntaxFlag.Experimental)) {
							return;
						}

						if (colorData.syntaxFlags.has(SyntaxFlag.HasNoneKeywords)) {
							return;
						}

						if (colorData.syntaxFlags.has(SyntaxFlag.RelativeColorSyntax)) {
							return;
						}

						return serializeRGB(colorData);
					}
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

/** postcss-color-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/* Transform the color() function in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: false,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-color-function',
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
