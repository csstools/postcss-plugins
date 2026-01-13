import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { Declaration, PluginCreator } from 'postcss';
import { isTokenHash, isTokenIdent, tokenize, TokenType } from '@csstools/css-tokenizer';
import { color, SyntaxFlag } from '@csstools/css-color-parser';
import { hasFallback, hasSupportsAtRuleAncestor } from '@csstools/utilities';
import type { FunctionNode} from '@csstools/css-parser-algorithms';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';

type basePluginOptions = {
	preserve: boolean,
}

const ALPHA_FUNCTION_REGEX = /\balpha\(/i;
const ALPHA_NAME_REGEX = /^alpha$/i;
const colorFunctionColorSpaces = new Set(['srgb', 'srgb-linear', 'display-p3', 'display-p3-linear', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'xyz', 'xyz-d50', 'xyz-d65']);


/** Transform the alpha() function in CSS. */
const basePlugin: PluginCreator<basePluginOptions> = (opts?: basePluginOptions) => {
	return {
		postcssPlugin: 'postcss-color-function',
		Declaration(decl: Declaration): void {
			const originalValue = decl.value;
			if (!(ALPHA_FUNCTION_REGEX.test(originalValue))) {
				return;
			}

			if (hasFallback(decl)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl, ALPHA_FUNCTION_REGEX)) {
				return;
			}

			const tokens = tokenize({ css: originalValue });

			const replaced = replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokens),
				(componentValue) => {
					if (!isFunctionNode(componentValue) || !ALPHA_NAME_REGEX.test(componentValue.getName())) {
						return;
					}

					for (let i = 0; i < componentValue.value.length; i++) {
						let argument = componentValue.value[i];

						while (isWhiteSpaceOrCommentNode(argument)) {
							i++;
							argument = componentValue.value[i];
						}

						if (isTokenNode(argument) && isTokenIdent(argument.value) && argument.value[4].value.toLowerCase() === 'from') {
							i++;
							argument = componentValue.value[i];
						}

						while (isWhiteSpaceOrCommentNode(argument)) {
							i++;
							argument = componentValue.value[i];
						}

						const colorArgument = argument;
						if (isFunctionNode(colorArgument)) {
							const colorFunctionName = colorArgument.getName().toLowerCase();
							if (colorFunctionName === 'var') {
								return;
							}

							if (colorFunctionName === 'color') {
								let colorSpace = '';
								for (let j = 0; j < colorArgument.value.length; j++) {
									const innerArgument = colorArgument.value[j];
									if (isTokenNode(innerArgument) && isTokenIdent(innerArgument.value) && colorFunctionColorSpaces.has(innerArgument.value[4].value.toLowerCase())) {
										if (colorSpace) {
											return;
										}

										colorSpace = innerArgument.value[4].value;
									}
								}

								if (!colorSpace) {
									return;
								}

								componentValue.name[1] = 'color(';
								componentValue.name[4].value = 'color';

								let channelKeywords = ['r', 'g', 'b'];
								if (colorSpace === 'xyz' || colorSpace === 'xyz-d50' || colorSpace === 'xyz-d65') {
									channelKeywords = ['x', 'y', 'z'];
								}

								componentValue.value.splice(
									i+1,
									0,
									new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
									new TokenNode([TokenType.Ident, colorSpace, -1, -1, { value: colorSpace }]),
									new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
									new TokenNode([TokenType.Ident, channelKeywords[0], -1, -1, { value: channelKeywords[0] }]),
									new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
									new TokenNode([TokenType.Ident, channelKeywords[1], -1, -1, { value: channelKeywords[1] }]),
									new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
									new TokenNode([TokenType.Ident, channelKeywords[2], -1, -1, { value: channelKeywords[2] }]),
								);

								return;
							}

							switch (colorFunctionName) {
								case 'rgb':
								case 'rgba':
									convertToRelativeColor(componentValue, i + 1, 'rgb', ['r', 'g', 'b']);
									return;
								case 'hsl':
								case 'hsla':
									convertToRelativeColor(componentValue, i + 1, 'hsl', ['h', 's', 'l']);
									return;
								case 'hwb':
									convertToRelativeColor(componentValue, i + 1, 'hwb', ['h', 'w', 'b']);
									return;
								case 'lab':
									convertToRelativeColor(componentValue, i + 1, 'lab', ['l', 'a', 'b']);
									return;
								case 'lch':
									convertToRelativeColor(componentValue, i + 1, 'lch', ['l', 'c', 'h']);
									return;
								case 'oklab':
									convertToRelativeColor(componentValue, i + 1, 'oklab', ['l', 'a', 'b']);
									return;
								case 'oklch':
									convertToRelativeColor(componentValue, i + 1, 'oklch', ['l', 'c', 'h']);
									return;

								default:
									break;
							}
						}

						if (isTokenNode(colorArgument) && (isTokenHash(colorArgument.value) || isTokenIdent(colorArgument.value))) {
							const colorData = color(colorArgument);
							if (!colorData) {
								return;
							}

							if (!(colorData.syntaxFlags.has(SyntaxFlag.Hex) || colorData.syntaxFlags.has(SyntaxFlag.ColorKeyword))) {
								return;
							}

							convertToRelativeColor(componentValue, i + 1, 'rgb', ['r', 'g', 'b']);

							return;
						}
					}
				},
			);

			const modified = stringify(replaced);
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

function convertToRelativeColor(componentValue: FunctionNode, index: number, newName: string, channelKeywords: [string, string, string]): void {
	componentValue.name[1] = newName + '(';
	componentValue.name[4].value = newName;

	componentValue.value.splice(
		index,
		0,
		new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
		new TokenNode([TokenType.Ident, channelKeywords[0], -1, -1, { value: channelKeywords[0] }]),
		new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
		new TokenNode([TokenType.Ident, channelKeywords[1], -1, -1, { value: channelKeywords[1] }]),
		new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
		new TokenNode([TokenType.Ident, channelKeywords[2], -1, -1, { value: channelKeywords[2] }]),
	);
}

basePlugin.postcss = true;

/** postcss-color-function plugin options */
export type pluginOptions = {
	/** Preserve the original notation. default: false */
	preserve?: boolean,
	/** Enable "@csstools/postcss-progressive-custom-properties". default: true */
	enableProgressiveCustomProperties?: boolean,
};

/** Transform the color() function in CSS. */
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
export { postcssPlugin as 'module.exports' };
