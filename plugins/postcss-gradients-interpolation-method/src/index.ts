import postcssProgressiveCustomProperties from '@csstools/postcss-progressive-custom-properties';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import type { PluginCreator } from 'postcss';
import { ColorStop, interpolateColorsInColorStopsList } from './color-stop-list';
import { color } from '@csstools/css-color-parser';
import { gradientFunctionRegex, gradientNameRegex } from './is-gradient';
import { hasSupportsAtRuleAncestor } from './has-supports-at-rule-ancestor';
import { isCommentNode, isTokenNode, isWhitespaceNode, TokenNode } from '@csstools/css-parser-algorithms';
import { isFunctionNode, parseCommaSeparatedListOfComponentValues, replaceComponentValues, stringify } from '@csstools/css-parser-algorithms';
import { tokenize, TokenType } from '@csstools/css-tokenizer';

const colorSpaceRegex = /^(srgb|srgb-linear|lab|oklab|xyz|xyz-d50|xyz-d65|hsl|hwb|lch|oklch)$/i;
const polarColorSpaceRegex = /^(hsl|hwb|lch|oklch)$/i;
const hueInterpolationMethodRegex = /^(shorter|longer|increasing|decreasing)$/i;
const inKeywordRegex = /^in$/i;
const hueKeywordRegex = /^hue$/i;

/**
 * Transform double-position gradients in CSS.
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
const basePlugin: PluginCreator<{ preserve: boolean }> = (opts?: { preserve?: boolean }) => {
	return {
		postcssPlugin: 'postcss-gradients-interpolation-method',
		Declaration(decl) {
			if (!gradientFunctionRegex.test(decl.value)) {
				return;
			}

			if (hasSupportsAtRuleAncestor(decl)) {
				return;
			}

			const tokens = tokenize({
				css: decl.value,
			});

			const modified = stringify(replaceComponentValues(
				parseCommaSeparatedListOfComponentValues(tokens),
				(componentValue) => {
					if (!isFunctionNode(componentValue)) {
						return;
					}

					const functionName = componentValue.getName();
					if (!gradientNameRegex.test(functionName)) {
						return;
					}

					let colorSpaceName = 'srgb';

					let inKeyword: TokenNode | null = null;
					let colorSpace: TokenNode | null = null;
					let hueInterpolationMethod: TokenNode | null = null;
					let hueKeyword: TokenNode | null = null;
					let firstComma: TokenNode | null = null;

					let remainder: Array<ComponentValue> = [];

					{
						let i = 0;
						let node = componentValue.value[i];

						{
							// Advance to "in" keyword
							while (!(isTokenNode(node) && node.value[0] === TokenType.Ident && inKeywordRegex.test(node.value[4].value))) {
								if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
									// comma before "in" keyword
									return;
								}

								i++;
								node = componentValue.value[i];
							}

							inKeyword = node;
							i++;
							node = componentValue.value[i];
						}

						while (isCommentNode(node) || isWhitespaceNode(node)) {
							i++;
							node = componentValue.value[i];
						}

						// color space
						if (
							isTokenNode(node) &&
							node.value[0] === TokenType.Ident &&
							colorSpaceRegex.test(node.value[4].value)
						) {
							if (colorSpace) {
								return;
							}

							colorSpace = node;
							colorSpaceName = node.value[4].value;

							i++;
							node = componentValue.value[i];
						}

						while (isCommentNode(node) || isWhitespaceNode(node)) {
							i++;
							node = componentValue.value[i];
						}

						// hue interpolation method
						if (
							isTokenNode(node) &&
								node.value[0] === TokenType.Ident &&
								hueInterpolationMethodRegex.test(node.value[4].value) &&
								polarColorSpaceRegex.test(colorSpaceName)
						) {
							if (hueInterpolationMethod || !colorSpace) {
								return;
							}

							hueInterpolationMethod = node;

							i++;
							node = componentValue.value[i];
						}

						while (isCommentNode(node) || isWhitespaceNode(node)) {
							i++;
							node = componentValue.value[i];
						}

						// "hue" keyword
						if (
							isTokenNode(node) &&
								node.value[0] === TokenType.Ident &&
								hueKeywordRegex.test(node.value[4].value)
						) {
							if (hueKeyword || !colorSpace || !hueInterpolationMethod) {
								return;
							}

							hueKeyword = node;

							i++;
							node = componentValue.value[i];
						}

						// Find first comma
						while (!isTokenNode(node) || node.value[0] !== TokenType.Comma) {
							i++;
							node = componentValue.value[i];
						}

						firstComma = node;
						remainder = componentValue.value.slice(i + 1);
					}

					if (!colorSpace) {
						return;
					} else if (hueInterpolationMethod && !hueKeyword) {
						return;
					} else if (hueKeyword && !hueInterpolationMethod) {
						return;
					}


					const colorStops: Array<ColorStop> = [];

					let currentColorStop: {
						color?: ComponentValue,
						positionA?: ComponentValue,
						positionB?: ComponentValue,
					} = {};

					for (let i = 0; i < remainder.length; i++) {
						const node = remainder[i];
						if (isCommentNode(node) || isWhitespaceNode(node)) {
							continue;
						}

						if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
							if (currentColorStop.color && currentColorStop.positionA) {
								colorStops.push({ color: currentColorStop.color, position: currentColorStop.positionA });

								if (currentColorStop.positionB) {
									colorStops.push({ color: currentColorStop.color, position: currentColorStop.positionB });
								}

								currentColorStop = {};
								continue;
							}

							return;
						}

						const colorData = color(node);
						if (colorData && currentColorStop.color) {
							return;
						}

						if (colorData) {
							currentColorStop.color = node;
							continue;
						}

						if (!currentColorStop.positionA) {
							currentColorStop.positionA = node;
							continue;
						}

						if (currentColorStop.positionA && !currentColorStop.positionB) {
							currentColorStop.positionB = node;
						}

						return;
					}

					if (!currentColorStop.color || !currentColorStop.positionA) {
						return;
					}

					colorStops.push({ color: currentColorStop.color, position: currentColorStop.positionA });

					if (currentColorStop.positionB) {
						colorStops.push({ color: currentColorStop.color, position: currentColorStop.positionB });
					}

					const modifiedColorStops = interpolateColorsInColorStopsList(colorStops, colorSpace, hueInterpolationMethod);
					if (!modifiedColorStops) {
						return;
					}

					const beforeColorStops = [
						...componentValue.value.slice(0, componentValue.value.indexOf(inKeyword)),
						...componentValue.value.slice(componentValue.value.indexOf(hueKeyword || colorSpace) + 1, componentValue.value.indexOf(firstComma)),
					];
					const hasMeaningfulPrefix = beforeColorStops.length > 0 && beforeColorStops.some((node) => !isCommentNode(node) && !isWhitespaceNode(node));
					if (hasMeaningfulPrefix) {
						beforeColorStops.push(
							new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
						);
					}

					componentValue.value = [
						...beforeColorStops,
						...modifiedColorStops,
					];
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

// Transform gradient interpolation methods.
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
