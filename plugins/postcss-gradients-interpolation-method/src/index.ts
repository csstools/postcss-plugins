import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { PluginCreator } from 'postcss';
import { IS_GRADIENT_FUNCTION } from './is-gradient';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { modifyGradientFunctionComponentValues } from './modify-gradient-component-values';
import { tokenize } from '@csstools/css-tokenizer';

type basePluginOptions = {
	preserve: boolean,
};

/** Transform gradients with interpolation methods in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-gradients-interpolation-method',
		Declaration(decl): void {
			if (!IS_GRADIENT_FUNCTION.test(decl.value)) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, IS_GRADIENT_FUNCTION)) {
				return;
			}

			const tokens = tokenize({ css: decl.value });
			const modifiedRGB = stringify(replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokens),
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

			if (modifiedRGB === decl.value) {
				return;
			}

			const modifiedP3 = stringify(replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokens),
				(componentValue) => {
					if (!isFunctionNode(componentValue)) {
						return;
					}

					const modifiedComponentValues = modifyGradientFunctionComponentValues(componentValue, true);
					if (modifiedComponentValues) {
						componentValue.value = modifiedComponentValues;
					}
				},
			));

			decl.cloneBefore({ value: modifiedRGB });

			if (modifiedRGB !== modifiedP3) {
				decl.cloneBefore({ value: modifiedP3 });
			}

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

/** Transform gradients with interpolation methods in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		enableProgressiveCustomProperties: true,
		preserve: true,
	}, opts);

	if (options.enableProgressiveCustomProperties) {
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
export { postcssPlugin as 'module.exports' };
