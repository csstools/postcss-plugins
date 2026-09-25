import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, PluginCreator } from 'postcss';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import { FunctionNode, isFunctionNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, parseListOfComponentValues, replaceComponentValues, stringify, TokenNode } from '@csstools/css-parser-algorithms';
import { tokenize, TokenType } from '@csstools/css-tokenizer';

const IMAGE_FUNCTION_REGEX = /\bimage\(/i;
const IMAGE_NAME_REGEX = /^image$/i;

// `image()` with a single argument is expanded into a `linear-gradient()` that
// references its contents twice. Nesting therefore doubles the output at every level.
// Bound the work and the resulting value length.
const MAX_EXPANSION_TOKENS = 100_000;
const MAX_EXPANSION_LENGTH = 100_000;

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

					// Materialize the contents once and build two independent copies.
					// Reusing the same nodes for both operands creates aliased AST nodes
					// which multiply the work on subsequent passes.
					const contentsTokens = componentValue.value.flatMap((x) => x.tokens());
					if (contentsTokens.length > MAX_EXPANSION_TOKENS) {
						throw new Error('Maximum image() expansion size exceeded, reduce the complexity of your value');
					}

					return new FunctionNode(
						[TokenType.Function, 'linear-gradient(', componentValue.name[2], componentValue.name[3], { value: 'linear-gradient' }],
						componentValue.endToken,
						[
							...parseListOfComponentValues(contentsTokens),
							new TokenNode(
								[TokenType.Comma, ',', componentValue.name[2], componentValue.name[3], undefined]
							),
							...parseListOfComponentValues(contentsTokens),
						]
					);
				},
			);

			const modifiedValue = stringify(replaced);
			if (modifiedValue.length > MAX_EXPANSION_LENGTH) {
				throw new Error('Maximum image() expansion length exceeded, reduce the complexity of your value');
			}

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
