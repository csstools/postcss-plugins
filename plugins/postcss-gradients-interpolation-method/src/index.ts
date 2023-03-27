import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import { gradientFunctionRegex } from './is-gradient';
import { hasFallback } from './has-fallback-decl';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { modifyGradientFunctionComponentValues } from './modify-gradient-component-values';
import { tokenize } from '@csstools/css-tokenizer';

type basePluginOptions = {
	preserve: boolean,
};

/* Transform gradients with interpolation methods in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-gradients-interpolation-method',
		Declaration(decl) {
			if (!gradientFunctionRegex.test(decl.value)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const modified = stringify(replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({ css: decl.value })),
				(componentValue) => {
					if (!isFunctionNode(componentValue)) {
						return;
					}

					const modifiedComponentValues = modifyGradientFunctionComponentValues(componentValue);
					if (modifiedComponentValues) {
						componentValue.value = modifiedComponentValues;
					}
				},
			));

			if (modified === decl.value) {
				return;
			}

			decl.cloneBefore({
				value: modified,
			});

			if (!opts?.preserve) {
				decl.remove();
			}
		},
	};
};

basePlugin.postcss = true;

/** postcss-gradients-interpolation-method plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: true */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/* Transform gradients with interpolation methods in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-gradients-interpolation-method',
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
