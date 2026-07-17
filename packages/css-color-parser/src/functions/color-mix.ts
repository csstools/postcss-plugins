import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import type { Color } from '@csstools/color-helpers';
import { ColorNotation } from '../color-notation';
import { isTokenIdent, isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';
import { calcFromComponentValues } from '@csstools/css-calc';
import { colorDataToForInterpolation, SyntaxFlag } from '../color-data';
import { isFunctionNode, isTokenNode, isWhiteSpaceOrCommentNode } from '@csstools/css-parser-algorithms';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { mathFunctionNames } from '@csstools/css-calc';
import { isTokenComma } from '@csstools/css-tokenizer';

const rectangularColorSpaces = new Set(['srgb', 'srgb-linear', 'display-p3', 'display-p3-linear', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'lab', 'oklab', 'xyz', 'xyz-d50', 'xyz-d65']);
const polarColorSpaces = new Set(['hsl', 'hwb', 'lch', 'oklch']);
const hueInterpolationMethods = new Set(['shorter', 'longer', 'increasing', 'decreasing']);

export function colorMix(colorMixNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	let inNode: ComponentValue | null = null;

	let colorSpace: string | null = null;
	let hueInterpolationMethod: string | null = null;
	let hueKeyword = false;

	for (let i = 0; i < colorMixNode.value.length; i++) {
		const node = colorMixNode.value[i];
		if (isWhiteSpaceOrCommentNode(node)) {
			continue;
		}

		if (!inNode) {
			if (
				!(
					isTokenNode(node) &&
					isTokenIdent(node.value) &&
					toLowerCaseAZ(node.value[4].value) === 'in'
				)
			) {
				return colorMixRectangular('oklab', colorMixComponents(colorMixNode.value, colorParser));
			}
		}

		if (
			isTokenNode(node) &&
			isTokenIdent(node.value)
		) {
			if (
				!inNode &&
				toLowerCaseAZ(node.value[4].value) === 'in'
			) {
				inNode = node;
				continue;
			}

			if (
				inNode &&
				!colorSpace
			) {
				colorSpace = toLowerCaseAZ(node.value[4].value);
				continue;
			}

			if (
				inNode &&
				colorSpace &&
				!hueInterpolationMethod &&
				polarColorSpaces.has(colorSpace)
			) {
				hueInterpolationMethod = toLowerCaseAZ(node.value[4].value);
				continue;
			}

			if (
				inNode &&
				colorSpace &&
				hueInterpolationMethod &&
				!hueKeyword &&
				toLowerCaseAZ(node.value[4].value) === 'hue'
			) {
				hueKeyword = true;
				continue;
			}

			return false;
		}

		if (
			isTokenNode(node) &&
			isTokenComma(node.value)
		) {
			if (!colorSpace) {
				return false;
			}

			if (
				!hueInterpolationMethod &&
				!hueKeyword
			) {
				if (rectangularColorSpaces.has(colorSpace)) {
					return colorMixRectangular(colorSpace, colorMixComponents(colorMixNode.value.slice(i + 1), colorParser));
				} else if (polarColorSpaces.has(colorSpace)) {
					return colorMixPolar(colorSpace, 'shorter', colorMixComponents(colorMixNode.value.slice(i + 1), colorParser));
				} else {
					return false;
				}
			}

			if (
				hueInterpolationMethod &&
				hueKeyword &&
				polarColorSpaces.has(colorSpace) &&
				hueInterpolationMethods.has(hueInterpolationMethod)
			) {
				return colorMixPolar(colorSpace, hueInterpolationMethod, colorMixComponents(colorMixNode.value.slice(i + 1), colorParser));
			}

			return false;
		}

		return false;
	}

	return false;
}

type ColorMixEntry = {
	color: ColorData,
	percentage: number | false
};

function colorMixComponents(componentValues: Array<ComponentValue>, colorParser: ColorParser): Array<ColorMixEntry> | false {
	const colors: Array<{ color: ColorData, percentage: number | false }> = [];

	let color: ColorData | false = false;
	let percentage: number | false = false;

	for (let i = 0; i < componentValues.length; i++) {
		let node = componentValues[i];
		if (isWhiteSpaceOrCommentNode(node)) {
			continue;
		}

		if (
			isTokenNode(node) &&
			isTokenComma(node.value)
		) {
			if (!color) {
				return false;
			}

			colors.push({
				color: color,
				percentage: percentage,
			});

			color = false;
			percentage = false;
			continue;
		}

		if (!color) {
			const parsedColor = colorParser(node);
			if (parsedColor) {
				color = parsedColor;
				continue;
			}
		}

		if (
			!percentage
		) {
			if (
				isFunctionNode(node) &&
				mathFunctionNames.has(toLowerCaseAZ(node.getName()))
			) {
				[[node]] = calcFromComponentValues([[node]], {
					censorIntoStandardRepresentableValues: true,
					precision: -1,
					toCanonicalUnits: true,
					rawPercentages: true,
				});

				if (!node || !isTokenNode(node) || !isTokenNumeric(node.value)) {
					return false;
				}

				if (Number.isNaN(node.value[4].value)) {
					// NaN does not escape a top-level calculation; it’s censored into a zero value
					node.value[4].value = 0;
				}
			}

			if (
				isTokenNode(node) &&
				isTokenPercentage(node.value) &&
				node.value[4].value >= 0
			) {
				percentage = node.value[4].value;
				continue;
			}
		}

		return false;
	}

	if (color) {
		colors.push({
			color: color,
			percentage: percentage,
		});
	} else {
		return false;
	}

	return colors;
}

function colorMixRectangular(colorSpace: string, items: Array<ColorMixEntry> | false): ColorData | false {
	if (!items || !items.length) {
		return false;
	}

	for (const item of items) {
		if (!item.percentage) {
			continue;
		}

		if (item.percentage < 0 || item.percentage > 100) {
			return false;
		}
	}

	// https://drafts.csswg.org/css-color-5/#color-mix
	// 1. Normalize mix percentages from the list of mix items passed to the function, with the "forced normalization" flag set to true, letting items and leftover be the result.
	const { items: normalizedItems, leftover } = normalizeMixPercentages(items, true);

	// 2. Let alpha mult be 1 - leftover, interpreting leftover as a number between 0 and 1.
	const alphaMultiplier = 1 - (leftover / 100);

	let outputColorNotation: ColorNotation;
	switch (colorSpace) {
		case 'srgb':
			outputColorNotation = ColorNotation.RGB;
			break;
		case 'srgb-linear':
			outputColorNotation = ColorNotation.Linear_sRGB;
			break;
		case 'display-p3':
			outputColorNotation = ColorNotation.Display_P3;
			break;
		case 'display-p3-linear':
			outputColorNotation = ColorNotation.Linear_Display_P3;
			break;
		case 'a98-rgb':
			outputColorNotation = ColorNotation.A98_RGB;
			break;
		case 'prophoto-rgb':
			outputColorNotation = ColorNotation.ProPhoto_RGB;
			break;
		case 'rec2020':
			outputColorNotation = ColorNotation.Rec2020;
			break;
		case 'lab':
			outputColorNotation = ColorNotation.Lab;
			break;
		case 'oklab':
			outputColorNotation = ColorNotation.OKLab;
			break;
		case 'xyz-d50':
			outputColorNotation = ColorNotation.XYZ_D50;
			break;
		case 'xyz':
		case 'xyz-d65':
			outputColorNotation = ColorNotation.XYZ_D65;
			break;
		default:
			return false;
	}

	// 3. If items is length 1, set color to the color of that sole item, converted to the specified interpolation <color-space>.
	if (normalizedItems.length === 1) {
		const color = colorDataToForInterpolation(normalizedItems[0].color, outputColorNotation);
		color.colorNotation = outputColorNotation;
		color.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);
		color.syntaxFlags.add(SyntaxFlag.ColorMix);

		if (typeof color.alpha === 'number') {
			// 4. Multiply the alpha component of color by alpha mult.
			color.alpha = color.alpha * alphaMultiplier;
		} else {
			return false;
		}

		return color;
	}

	// 3.1. Let item stack be a stack made by reversing items. (Thus, with the first item at the top of the stack.)
	normalizedItems.reverse();

	// 3.2. While item stack has length 2 or greater:
	while (normalizedItems.length >= 2) {
		// 3.2.1. Pop from item stack twice, letting a and b be the two results in order.
		const a_color = normalizedItems.pop();
		const b_color = normalizedItems.pop();
		if (!a_color || !b_color) {
			return false;
		}

		// 3.2.1. Let combined percentage be the sum of a and b’s percentages.
		const combined_percentage = a_color.percentage + b_color.percentage;

		// 3.2.2. with a progress percentage equal to (b’s percentage) / combined percentage), if combined percentage is greater than 0, and 0.5 otherwise
		const progress = combined_percentage > 0 ? b_color.percentage / combined_percentage : 0.5;

		// 3.2.2. Interpolate a and b’s colors as described in CSS Color 4 § 13. Color Interpolation,
		// with a progress percentage equal to (b’s percentage) / combined percentage),
		// if combined percentage is greater than 0, and 0.5 otherwise.
		// If the specified color space is a cylindrical polar color space,
		// then the <hue-interpolation-method> controls the interpolation of hue,
		// as described in CSS Color 4 § 13.4 Hue Interpolation.
		// If no <hue-interpolation-method> is specified, assume shorter.
		const mixed_color = colorMixRectangularPair(outputColorNotation, a_color.color, b_color.color, progress);
		if (!mixed_color) {
			return false;
		}

		// 3.2.3. Create a new mix item with the resulting color and a percentage of combined percentage, and push it onto item stack.
		normalizedItems.push({
			color: mixed_color,
			percentage: combined_percentage
		});
	}

	// 3.3. Set color to the color of the sole remaining item in item stack.
	const colorData = normalizedItems[0]?.color;
	if (!colorData) {
		return false;
	}

	// 4. Multiply the alpha component of color by alpha mult.
	if (typeof colorData.alpha === 'number') {
		colorData.alpha = colorData.alpha * alphaMultiplier;
	} else {
		return false;
	}

	if (items.some((x) => x.color.syntaxFlags.has(SyntaxFlag.Experimental))) {
		colorData.syntaxFlags.add(SyntaxFlag.Experimental);
	}

	if (items.length !== 2) {
		colorData.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);
	}

	return colorData;
}

function colorMixRectangularPair(colorNotation: ColorNotation, a_color: ColorData, b_color: ColorData, progress: number): ColorData | false {
	let a_alpha = a_color.alpha;
	if (typeof a_alpha !== 'number') {
		return false;
	}

	let b_alpha = b_color.alpha;
	if (typeof b_alpha !== 'number') {
		return false;
	}

	a_alpha = Number.isNaN(a_alpha) ? b_alpha : a_alpha;
	b_alpha = Number.isNaN(b_alpha) ? a_alpha : b_alpha;

	const a_channels = colorDataToForInterpolation(a_color, colorNotation).channels;
	const b_channels = colorDataToForInterpolation(b_color, colorNotation).channels;

	a_channels[0] = fillInMissingComponent(a_channels[0], b_channels[0]);
	b_channels[0] = fillInMissingComponent(b_channels[0], a_channels[0]);

	a_channels[1] = fillInMissingComponent(a_channels[1], b_channels[1]);
	b_channels[1] = fillInMissingComponent(b_channels[1], a_channels[1]);

	a_channels[2] = fillInMissingComponent(a_channels[2], b_channels[2]);
	b_channels[2] = fillInMissingComponent(b_channels[2], a_channels[2]);

	a_channels[0] = premultiply(a_channels[0], a_alpha);
	a_channels[1] = premultiply(a_channels[1], a_alpha);
	a_channels[2] = premultiply(a_channels[2], a_alpha);

	b_channels[0] = premultiply(b_channels[0], b_alpha);
	b_channels[1] = premultiply(b_channels[1], b_alpha);
	b_channels[2] = premultiply(b_channels[2], b_alpha);

	const alpha = interpolate(a_alpha, b_alpha, progress);
	const outputChannels: Color = [
		un_premultiply(interpolate(a_channels[0], b_channels[0], progress), alpha),
		un_premultiply(interpolate(a_channels[1], b_channels[1], progress), alpha),
		un_premultiply(interpolate(a_channels[2], b_channels[2], progress), alpha),
	];

	const colorData: ColorData = {
		colorNotation: colorNotation,
		channels: outputChannels,
		alpha: alpha,
		syntaxFlags: (new Set([SyntaxFlag.ColorMix])),
	};

	return colorData;
}

function colorMixPolar(colorSpace: string, hueInterpolationMethod: string, items: Array<ColorMixEntry> | false): ColorData | false {
	if (!items || !items.length) {
		return false;
	}

	for (const item of items) {
		if (!item.percentage) {
			continue;
		}

		if (item.percentage < 0 || item.percentage > 100) {
			return false;
		}
	}

	// https://drafts.csswg.org/css-color-5/#color-mix
	// 1. Normalize mix percentages from the list of mix items passed to the function, with the "forced normalization" flag set to true, letting items and leftover be the result.
	const { items: normalizedItems, leftover } = normalizeMixPercentages(items, true);

	// 2. Let alpha mult be 1 - leftover, interpreting leftover as a number between 0 and 1.
	const alphaMultiplier = 1 - (leftover / 100);

	let outputColorNotation: ColorNotation;
	switch (colorSpace) {
		case 'hsl':
			outputColorNotation = ColorNotation.HSL;
			break;
		case 'hwb':
			outputColorNotation = ColorNotation.HWB;
			break;
		case 'lch':
			outputColorNotation = ColorNotation.LCH;
			break;
		case 'oklch':
			outputColorNotation = ColorNotation.OKLCH;
			break;
		default:
			return false;
	}

	// 3. If items is length 1, set color to the color of that sole item, converted to the specified interpolation <color-space>.
	if (normalizedItems.length === 1) {
		const color = colorDataToForInterpolation(normalizedItems[0].color, outputColorNotation);
		color.colorNotation = outputColorNotation;
		color.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);
		color.syntaxFlags.add(SyntaxFlag.ColorMix);

		if (typeof color.alpha === 'number') {
			// 4. Multiply the alpha component of color by alpha mult.
			color.alpha = color.alpha * alphaMultiplier;
		} else {
			return false;
		}

		return color;
	}

	// 3.1. Let item stack be a stack made by reversing items. (Thus, with the first item at the top of the stack.)
	normalizedItems.reverse();

	// 3.2. While item stack has length 2 or greater:
	while (normalizedItems.length >= 2) {
		// 3.2.1. Pop from item stack twice, letting a and b be the two results in order.
		const a_color = normalizedItems.pop();
		const b_color = normalizedItems.pop();
		if (!a_color || !b_color) {
			return false;
		}

		// 3.2.1. Let combined percentage be the sum of a and b’s percentages.
		const combined_percentage = a_color.percentage + b_color.percentage;

		// 3.2.2. with a progress percentage equal to (b’s percentage) / combined percentage), if combined percentage is greater than 0, and 0.5 otherwise
		const progress = combined_percentage > 0 ? b_color.percentage / combined_percentage : 0.5;

		// 3.2.2. Interpolate a and b’s colors as described in CSS Color 4 § 13. Color Interpolation,
		// with a progress percentage equal to (b’s percentage) / combined percentage),
		// if combined percentage is greater than 0, and 0.5 otherwise.
		// If the specified color space is a cylindrical polar color space,
		// then the <hue-interpolation-method> controls the interpolation of hue,
		// as described in CSS Color 4 § 13.4 Hue Interpolation.
		// If no <hue-interpolation-method> is specified, assume shorter.
		const mixed_color = colorMixPolarPair(outputColorNotation, hueInterpolationMethod, a_color.color, b_color.color, progress);
		if (!mixed_color) {
			return false;
		}

		// 3.2.3. Create a new mix item with the resulting color and a percentage of combined percentage, and push it onto item stack.
		normalizedItems.push({
			color: mixed_color,
			percentage: combined_percentage
		});
	}

	// 3.3. Set color to the color of the sole remaining item in item stack.
	const colorData = normalizedItems[0]?.color;
	if (!colorData) {
		return false;
	}

	// 4. Multiply the alpha component of color by alpha mult.
	if (typeof colorData.alpha === 'number') {
		colorData.alpha = colorData.alpha * alphaMultiplier;
	} else {
		return false;
	}

	if (items.some((x) => x.color.syntaxFlags.has(SyntaxFlag.Experimental))) {
		colorData.syntaxFlags.add(SyntaxFlag.Experimental);
	}

	if (items.length !== 2) {
		colorData.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);
	}

	return colorData;
}

function colorMixPolarPair(colorNotation: ColorNotation, hueInterpolationMethod: string, a_color: ColorData, b_color: ColorData, progress: number): ColorData | false {
	let a_hue = 0;
	let b_hue = 0;

	let a_first = 0;
	let b_first = 0;

	let a_second = 0;
	let b_second = 0;

	let a_alpha = a_color.alpha;
	if (typeof a_alpha !== 'number') {
		return false;
	}

	let b_alpha = b_color.alpha;
	if (typeof b_alpha !== 'number') {
		return false;
	}

	a_alpha = Number.isNaN(a_alpha) ? b_alpha : a_alpha;
	b_alpha = Number.isNaN(b_alpha) ? a_alpha : b_alpha;

	const a_channels = colorDataToForInterpolation(a_color, colorNotation).channels;
	const b_channels = colorDataToForInterpolation(b_color, colorNotation).channels;

	switch (colorNotation) {
		case ColorNotation.HSL:
		case ColorNotation.HWB:
			a_hue = a_channels[0];
			b_hue = b_channels[0];

			a_first = a_channels[1];
			b_first = b_channels[1];

			a_second = a_channels[2];
			b_second = b_channels[2];

			break;
		case ColorNotation.LCH:
		case ColorNotation.OKLCH:
			a_first = a_channels[0];
			b_first = b_channels[0];

			a_second = a_channels[1];
			b_second = b_channels[1];

			a_hue = a_channels[2];
			b_hue = b_channels[2];

			break;
		default:
			break;
	}

	a_first = fillInMissingComponent(a_first, b_first);
	b_first = fillInMissingComponent(b_first, a_first);

	a_second = fillInMissingComponent(a_second, b_second);
	b_second = fillInMissingComponent(b_second, a_second);

	a_hue = fillInMissingComponent(a_hue, b_hue);
	b_hue = fillInMissingComponent(b_hue, a_hue);
	if (Number.isNaN(a_hue) && Number.isNaN(b_hue)) {
		// noop
	} else {
		if (Number.isNaN(a_hue)) {
			a_hue = 0;
		} else if (Number.isNaN(b_hue)) {
			b_hue = 0;
		}

		const angleDiff = b_hue - a_hue;

		switch (hueInterpolationMethod) {
			case 'shorter':
				if (angleDiff > 180) {
					a_hue += 360;
				} else if (angleDiff < -180) {
					b_hue += 360;
				}

				break;
			case 'longer':
				if (-180 < angleDiff && angleDiff < 180) {
					if (angleDiff > 0) {
						a_hue += 360;
					} else {
						b_hue += 360;
					}
				}

				break;
			case 'increasing':
				if (angleDiff < 0) {
					b_hue += 360;
				}

				break;
			case 'decreasing':
				if (angleDiff > 0) {
					a_hue += 360;
				}

				break;
			default:
				throw new Error('Unknown hue interpolation method');
		}
	}

	a_first = premultiply(a_first, a_alpha);
	a_second = premultiply(a_second, a_alpha);
	b_first = premultiply(b_first, b_alpha);
	b_second = premultiply(b_second, b_alpha);

	let outputChannels: Color = [0, 0, 0];
	const alpha = interpolate(a_alpha, b_alpha, progress);

	switch (colorNotation) {
		case ColorNotation.HSL:
		case ColorNotation.HWB:
			outputChannels = [
				interpolate(a_hue, b_hue, progress),
				un_premultiply(interpolate(a_first, b_first, progress), alpha),
				un_premultiply(interpolate(a_second, b_second, progress), alpha),
			];

			break;
		case ColorNotation.LCH:
		case ColorNotation.OKLCH:
			outputChannels = [
				un_premultiply(interpolate(a_first, b_first, progress), alpha),
				un_premultiply(interpolate(a_second, b_second, progress), alpha),
				interpolate(a_hue, b_hue, progress),
			];

			break;
		default:
			break;
	}

	const colorData: ColorData = {
		colorNotation: colorNotation,
		channels: outputChannels,
		alpha: alpha,
		syntaxFlags: (new Set([SyntaxFlag.ColorMix])),
	};

	return colorData;
}

function fillInMissingComponent(a: number, b: number): number {
	if (Number.isNaN(a)) {
		return b;
	}

	return a;
}

function interpolate(start: number, end: number, p: number): number {
	return (start * (1 - p)) + end * p;
}

function premultiply(x: number, alpha: number): number {
	if (Number.isNaN(alpha)) {
		return x;
	}

	if (Number.isNaN(x)) {
		return Number.NaN;
	}

	return x * alpha;
}

function un_premultiply(x: number, alpha: number): number {
	if (alpha === 0) {
		return x;
	}

	if (Number.isNaN(alpha)) {
		return x;
	}

	if (Number.isNaN(x)) {
		return Number.NaN;
	}

	return x / alpha;
}

// https://drafts.csswg.org/css-values-5/#normalize-mix-percentages
function normalizeMixPercentages<T>(mix_items: Array<{ color: T, percentage: number | false }>, force_normalization: boolean = false): { items: Array<{ color: T, percentage: number }>, leftover: number } {
	// 1. Let specified sum be the sum of the percentages specified in items (clamped to 100%), or 0% if the percentages are omitted for all items.
	let specified_sum = 0;
	let number_of_omitted_percentages = 0;
	for (const item of mix_items) {
		if (item.percentage) {
			specified_sum += item.percentage;
		}

		if (item.percentage === false) {
			number_of_omitted_percentages++;
		}
	}

	specified_sum = Math.min(100, specified_sum);

	// 2. For each omitted percentage in items, set it to (100% - specified sum) / (number of omitted percentages).
	for (const item of mix_items) {
		if (item.percentage === false) {
			item.percentage = (100 - specified_sum) / (number_of_omitted_percentages);
		}
	}

	const mix_items_with_percentages = (mix_items as Array<{ color: T, percentage: number }>).slice();

	// 3. Let total be the sum of the percentages of all the items.
	let total = 0;
	for (const item of mix_items_with_percentages) {
		total += item.percentage;
	}

	// 4. If total is greater than 100%, or if total is greater than 0% and the force normalization flag is true, multiply every percentage in items by (100% / total).
	if (total > 100 || (total > 0 && force_normalization)) {
		for (const item of mix_items_with_percentages) {
			item.percentage = item.percentage * (100 / total);
		}
	}

	let leftover = 0;
	if (total < 100) {
		leftover = 100 - total;
	}

	return {
		items: mix_items_with_percentages,
		leftover: leftover,
	};
}
