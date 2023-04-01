import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { gradientNameRegex } from './is-gradient';
import { interpolateColorsInColorStopsList } from './color-stop-list';
import { isCommentNode, isTokenNode, isWhitespaceNode, TokenNode, WhitespaceNode } from '@csstools/css-parser-algorithms';
import { parseColorStops } from './parse-color-stops';
import { TokenType } from '@csstools/css-tokenizer';

const colorSpaceRegex = /^(srgb|srgb-linear|lab|oklab|xyz|xyz-d50|xyz-d65|hsl|hwb|lch|oklch)$/i;
const polarColorSpaceRegex = /^(hsl|hwb|lch|oklch)$/i;
const hueInterpolationMethodRegex = /^(shorter|longer|increasing|decreasing)$/i;
const inKeywordRegex = /^in$/i;
const hueKeywordRegex = /^hue$/i;

export function modifyGradientFunctionComponentValues(gradientFunction: FunctionNode, wideGamut = false): Array<ComponentValue> | false {
	const functionName = gradientFunction.getName();
	if (!gradientNameRegex.test(functionName)) {
		return false;
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
		let node = gradientFunction.value[i];

		{
			// Advance to "in" keyword
			while (!(isTokenNode(node) && node.value[0] === TokenType.Ident && inKeywordRegex.test(node.value[4].value))) {
				if (isTokenNode(node) && node.value[0] === TokenType.Comma) {
					// comma before "in" keyword
					return false;
				}

				i++;
				node = gradientFunction.value[i];
			}

			inKeyword = node;
			i++;
			node = gradientFunction.value[i];
		}

		while (isCommentNode(node) || isWhitespaceNode(node)) {
			i++;
			node = gradientFunction.value[i];
		}

		// color space
		if (
			isTokenNode(node) &&
			node.value[0] === TokenType.Ident &&
			colorSpaceRegex.test(node.value[4].value)
		) {
			if (colorSpace) {
				return false;
			}

			colorSpace = node;
			colorSpaceName = node.value[4].value;

			i++;
			node = gradientFunction.value[i];
		}

		while (isCommentNode(node) || isWhitespaceNode(node)) {
			i++;
			node = gradientFunction.value[i];
		}

		// hue interpolation method
		if (
			isTokenNode(node) &&
			node.value[0] === TokenType.Ident &&
			hueInterpolationMethodRegex.test(node.value[4].value) &&
			polarColorSpaceRegex.test(colorSpaceName)
		) {
			if (hueInterpolationMethod || !colorSpace) {
				return false;
			}

			hueInterpolationMethod = node;

			i++;
			node = gradientFunction.value[i];
		}

		while (isCommentNode(node) || isWhitespaceNode(node)) {
			i++;
			node = gradientFunction.value[i];
		}

		// "hue" keyword
		if (
			isTokenNode(node) &&
			node.value[0] === TokenType.Ident &&
			hueKeywordRegex.test(node.value[4].value)
		) {
			if (hueKeyword || !colorSpace || !hueInterpolationMethod) {
				return false;
			}

			hueKeyword = node;

			i++;
			node = gradientFunction.value[i];
		}

		// Find first comma
		while (!isTokenNode(node) || node.value[0] !== TokenType.Comma) {
			i++;
			node = gradientFunction.value[i];
		}

		firstComma = node;
		remainder = gradientFunction.value.slice(i + 1);
	}

	if (!colorSpace) {
		return false;
	} else if (hueInterpolationMethod && !hueKeyword) {
		return false;
	} else if (hueKeyword && !hueInterpolationMethod) {
		return false;
	}

	const colorStops = parseColorStops(remainder);
	if (!colorStops) {
		return false;
	}

	const modifiedColorStops = interpolateColorsInColorStopsList(colorStops, colorSpace, hueInterpolationMethod, wideGamut);
	if (!modifiedColorStops) {
		return false;
	}

	const beforeColorStops = trim([
		...gradientFunction.value.slice(0, gradientFunction.value.indexOf(inKeyword)),
		...gradientFunction.value.slice(gradientFunction.value.indexOf(hueKeyword || colorSpace) + 1, gradientFunction.value.indexOf(firstComma)),
	]);
	const hasMeaningfulPrefix = beforeColorStops.length > 0 && beforeColorStops.some((node) => !isCommentNode(node));
	if (hasMeaningfulPrefix) {
		beforeColorStops.push(
			new TokenNode([TokenType.Comma, ',', -1, -1, undefined]),
			new WhitespaceNode([[TokenType.Whitespace, ' ', -1, -1, undefined]]),
		);
	}

	return trim([
		...beforeColorStops,
		...trim(modifiedColorStops),
	]);
}

function trim(x: Array<ComponentValue>): Array<ComponentValue> {
	let firstMeaningfulIndex = 0;
	let lastMeaningfulIndex = x.length - 1;

	for (let i = 0; i < x.length; i++) {
		if (isWhitespaceNode(x[i])) {
			continue;
		}

		firstMeaningfulIndex = i;
		break;
	}

	for (let i = x.length - 1; i >= 0; i--) {
		if (isWhitespaceNode(x[i])) {
			continue;
		}

		lastMeaningfulIndex = i;
		break;
	}

	return x.slice(firstMeaningfulIndex, lastMeaningfulIndex + 1);
}
