import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import type { Color } from '@csstools/color-helpers';
import { ColorNotation } from '../color-notation';
import { isTokenIdent, isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';
import { calcFromComponentValues } from '@csstools/css-calc';
import { colorDataTo, SyntaxFlag } from '../color-data';
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
				colorSpace &&
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
	percentage: number
}

type ColorMixItems = {
	colors: Array<ColorMixEntry>,
	alphaMultiplier: number,
}

function colorMixComponents(componentValues: Array<ComponentValue>, colorParser: ColorParser): ColorMixItems | false {
	const colors: Array<{ color: ColorData, percentage: number | false }> = [];

	let alphaMultiplier = 1;

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

	let pSum = 0;
	let pOmitted = 0;
	for (let i = 0; i < colors.length; i++) {
		const p = colors[i].percentage;
		if (p === false) {
			pOmitted++;
			continue
		}

		if (p < 0 || p > 100) {
			return false;
		}

		pSum += p;
	}

	const pRemainder = Math.max(0, 100 - pSum);

	pSum = 0;
	for (let i = 0; i < colors.length; i++) {
		if (colors[i].percentage === false) {
			colors[i].percentage = pRemainder / pOmitted;
		}

		pSum += colors[i].percentage as number;
	}

	if (pSum === 0) { // The sum of explicitly provided mix percentages is `0`
		return {
			colors: [
				{
					color: {
						channels: [0, 0, 0],
						colorNotation: ColorNotation.sRGB,
						alpha: 0,
						syntaxFlags: new Set(),
					},
					percentage: 0
				}
			],
			alphaMultiplier: 0,
		};
	}

	if (pSum > 100) {
		for (let i = 0; i < colors.length; i++) {
			let p = colors[i].percentage as number; // already handled all `false` cases

			p = (p / pSum) * 100;
			colors[i].percentage = p;
		}
	}

	if (pSum < 100) {
		alphaMultiplier = pSum / 100;

		for (let i = 0; i < colors.length; i++) {
			let p = colors[i].percentage as number; // already handled all `false` cases

			p = (p / pSum) * 100;
			colors[i].percentage = p;
		}
	}

	return {
		colors: colors as ColorMixItems['colors'], // already handled all percentage `false` cases
		alphaMultiplier: alphaMultiplier,
	};
}

function colorMixRectangular(colorSpace: string, items: ColorMixItems | false): ColorData | false {
	if (!items || !items.colors.length) {
		return false;
	}

	const colors = items.colors.slice();
	colors.reverse();

	let outputColorNotation: ColorNotation = ColorNotation.RGB;
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

	if (colors.length === 1) {
		const color = colorDataTo(colors[0].color, outputColorNotation);
		color.colorNotation = outputColorNotation;
		color.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);

		if (typeof color.alpha === 'number') {
			color.alpha = color.alpha * items.alphaMultiplier;
		} else {
			return false;
		}

		return color;
	}

	while (colors.length >= 2) {
		// Pop from item stack twice, letting a and b be the two results in order.
		const a_color = colors.pop();
		const b_color = colors.pop();

		if (!a_color || !b_color) {
			return false;
		}

		const mixed_color = colorMixRectangularPair(outputColorNotation, a_color.color, a_color.percentage, b_color.color, b_color.percentage);
		if (!mixed_color) {
			return false;
		}

		colors.push({
			color: mixed_color,
			percentage: a_color.percentage + b_color.percentage
		})
	}

	const colorData = colors[0]?.color;
	if (!colorData) {
		return false
	}

	if (items.colors.some((x) => x.color.syntaxFlags.has(SyntaxFlag.Experimental))) {
		colorData.syntaxFlags.add(SyntaxFlag.Experimental);
	}

	if (typeof colorData.alpha === 'number') {
		colorData.alpha = colorData.alpha * items.alphaMultiplier
	} else {
		return false;
	}

	if (items.colors.length !== 2) {
		colorData.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);
	}

	return colorData;
}

function colorMixRectangularPair(colorNotation: ColorNotation, a_color: ColorData, a_percentage: number, b_color: ColorData, b_percentage: number): ColorData | false {
	const ratio = a_percentage / (a_percentage + b_percentage);

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

	const a_channels = colorDataTo(a_color, colorNotation).channels;
	const b_channels = colorDataTo(b_color, colorNotation).channels;

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

	const alpha = interpolate(a_alpha, b_alpha, ratio);
	const outputChannels: Color = [
		un_premultiply(interpolate(a_channels[0], b_channels[0], ratio), alpha),
		un_premultiply(interpolate(a_channels[1], b_channels[1], ratio), alpha),
		un_premultiply(interpolate(a_channels[2], b_channels[2], ratio), alpha),
	];

	const colorData: ColorData = {
		colorNotation: colorNotation,
		channels: outputChannels,
		alpha: alpha,
		syntaxFlags: (new Set([SyntaxFlag.ColorMix])),
	};

	return colorData;
}

function colorMixPolar(colorSpace: string, hueInterpolationMethod: string, items: ColorMixItems | false): ColorData | false {
	if (!items || !items.colors.length) {
		return false;
	}

	const colors = items.colors.slice();
	colors.reverse();

	let outputColorNotation: ColorNotation = ColorNotation.HSL;
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

	if (colors.length === 1) {
		const color = colorDataTo(colors[0].color, outputColorNotation);
		color.colorNotation = outputColorNotation;
		color.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);

		if (typeof color.alpha === 'number') {
			color.alpha = color.alpha * items.alphaMultiplier;
		} else {
			return false;
		}

		return color;
	}

	while (colors.length >= 2) {
		// Pop from item stack twice, letting a and b be the two results in order.
		const a_color = colors.pop();
		const b_color = colors.pop();

		if (!a_color || !b_color) {
			return false;
		}

		const mixed_color = colorMixPolarPair(outputColorNotation, hueInterpolationMethod, a_color.color, a_color.percentage, b_color.color, b_color.percentage);
		if (!mixed_color) {
			return false;
		}

		colors.push({
			color: mixed_color,
			percentage: a_color.percentage + b_color.percentage
		})
	}

	const colorData = colors[0]?.color;
	if (!colorData) {
		return false
	}

	if (items.colors.some((x) => x.color.syntaxFlags.has(SyntaxFlag.Experimental))) {
		colorData.syntaxFlags.add(SyntaxFlag.Experimental);
	}

	if (typeof colorData.alpha === 'number') {
		colorData.alpha = colorData.alpha * items.alphaMultiplier
	} else {
		return false;
	}

	if (items.colors.length !== 2) {
		colorData.syntaxFlags.add(SyntaxFlag.ColorMixVariadic);
	}

	return colorData;
}

function colorMixPolarPair(colorNotation: ColorNotation, hueInterpolationMethod: string, a_color: ColorData, a_percentage: number, b_color: ColorData, b_percentage: number): ColorData | false {
	const ratio = a_percentage / (a_percentage + b_percentage);

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

	const a_channels = colorDataTo(a_color, colorNotation).channels;
	const b_channels = colorDataTo(b_color, colorNotation).channels;

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

	a_hue = fillInMissingComponent(a_hue, b_hue);
	if (Number.isNaN(a_hue)) {
		a_hue = 0;
	}

	b_hue = fillInMissingComponent(b_hue, a_hue);
	if (Number.isNaN(b_hue)) {
		b_hue = 0;
	}

	a_first = fillInMissingComponent(a_first, b_first);
	b_first = fillInMissingComponent(b_first, a_first);

	a_second = fillInMissingComponent(a_second, b_second);
	b_second = fillInMissingComponent(b_second, a_second);

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

	a_first = premultiply(a_first, a_alpha);
	a_second = premultiply(a_second, a_alpha);
	b_first = premultiply(b_first, b_alpha);
	b_second = premultiply(b_second, b_alpha);

	let outputChannels: Color = [0, 0, 0];
	const alpha = interpolate(a_alpha, b_alpha, ratio);

	switch (colorNotation) {
		case ColorNotation.HSL:
		case ColorNotation.HWB:
			outputChannels = [
				interpolate(a_hue, b_hue, ratio),
				un_premultiply(interpolate(a_first, b_first, ratio), alpha),
				un_premultiply(interpolate(a_second, b_second, ratio), alpha),
			];

			break;
		case ColorNotation.LCH:
		case ColorNotation.OKLCH:
			outputChannels = [
				un_premultiply(interpolate(a_first, b_first, ratio), alpha),
				un_premultiply(interpolate(a_second, b_second, ratio), alpha),
				interpolate(a_hue, b_hue, ratio),
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
	return (start * p) + end * (1 - p);
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
