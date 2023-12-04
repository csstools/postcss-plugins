import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration } from 'postcss';
import type { PluginCreator } from 'postcss';
import { tokenize } from '@csstools/css-tokenizer';
import { color, serializeRGB, SyntaxFlag } from '@csstools/css-color-parser';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor, rgb_hsl_functionRegex } from './has-supports-at-rule-ancestor';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { serializeHSL } from '@csstools/css-color-parser';

type basePluginOptions = {
	preserve: boolean,
};

const rgb_hsl_nameRegex = /^(?:rgb|hsl)a?$/i;

/* Transform the color functional notation in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-color-functional-notation',
		Declaration: (decl: Declaration) => {
			const originalValue = decl.value;
			if (!(rgb_hsl_functionRegex.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const replacedRGB = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({ css: originalValue })),
				(componentValue) => {
					if (isFunctionNode(componentValue) && rgb_hsl_nameRegex.test(componentValue.getName())) {
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

						if (colorData.colorNotation === 'hsl') {
							return serializeHSL(colorData);
						}

						return serializeRGB(colorData);
					}
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

/* Transform the color functional notation in CSS. */
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
