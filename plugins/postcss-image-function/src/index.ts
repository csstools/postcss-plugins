import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, PluginCreator } from 'postcss';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { FunctionNode, isFunctionNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify, TokenNode } from '@csstools/css-parser-algorithms';
import { tokenize, TokenType } from '@csstools/css-tokenizer';

const IMAGE_FUNCTION_REGEX = /\bimage\(/i;
const IMAGE_NAME_REGEX = /^image$/i;

/** postcss-image-function plugin options */
export type basePluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
};

/** Transform image() functions in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-image-function',
		Declaration(decl: Declaration): void {
			const originalValue = decl.value;
			if (!(IMAGE_FUNCTION_REGEX.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, IMAGE_FUNCTION_REGEX)) {
				return;
			}

			const replaced = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokenize({ css: originalValue })),
				(componentValue) => {
					if (!isFunctionNode(componentValue) || !IMAGE_NAME_REGEX.test(componentValue.getName())) {
						return;
					}

					if (componentValue.value.filter((x) => !isWhiteSpaceOrCommentNode(x)).length !== 1) {
						return;
					}

					return new FunctionNode(
						[TokenType.Function, 'linear-gradient(', componentValue.name[2], componentValue.name[3], { value: 'linear-gradient' }],
						componentValue.endToken,
						[
							...componentValue.value,
							new TokenNode(
								[TokenType.Comma, ',', componentValue.name[2], componentValue.name[3], undefined]
							),
							...componentValue.value,
						]
					);
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

/** postcss-image-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/** Transform image() functions in CSS. */
const postcssPlugin: PluginCreator<pluginOptions> = (opts?: pluginOptions) => {
	const options = Object.assign({
		preserve: false,
		enableProgressiveCustomProperties: true,
	}, opts);

	if (options.enableProgressiveCustomProperties && options.preserve) {
		return {
			postcssPlugin: 'postcss-image-function',
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
