import type { ColorData } from '../color-data';
import type { ColorParser } from '../color-parser';
import type { ComponentValue, FunctionNode } from '@csstools/css-parser-algorithms';
import { Color } from '@csstools/color-helpers';
import { ColorNotation } from '../color-notation';
import { isTokenIdent, isTokenNumeric, isTokenPercentage } from '@csstools/css-tokenizer';
import { calcFromComponentValues } from '@csstools/css-calc';
import { colorDataTo, SyntaxFlag } from '../color-data';
import { isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { mathFunctionNames } from '@csstools/css-calc';
import { isTokenComma } from '@csstools/css-tokenizer';

const rectangularColorSpaces = new Set(['srgb', 'srgb-linear', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'lab', 'oklab', 'xyz', 'xyz-d50', 'xyz-d65']);
const polarColorSpaces = new Set(['hsl', 'hwb', 'lch', 'oklch']);
const hueInterpolationMethods = new Set(['shorter', 'longer', 'increasing', 'decreasing']);

export function colorMix(colorMixNode: FunctionNode, colorParser: ColorParser): ColorData | false {
	let inNode: ComponentValue | null = null;

	let colorSpace: string | null = null;
	let hueInterpolationMethod: string | null = null;
	let hueKeyword = false;

	for (let i = 0; i < colorMixNode.value.length; i++) {
		const node = colorMixNode.value[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
			continue;
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

type ColorMixColors = {
	a: ColorMixEntry,
	b: ColorMixEntry,
	alphaMultiplier: number,
}

function colorMixComponents(componentValues: Array<ComponentValue>, colorParser: ColorParser): ColorMixColors | false {
	const colors: Array<{ color: ColorData, percentage: number | false }> = [];

	let alphaMultiplier = 1;

	let color: ColorData | false = false;
	let percentage: number | false = false;

	for (let i = 0; i < componentValues.length; i++) {
		let node = componentValues[i];
		if (isWhitespaceNode(node) || isCommentNode(node)) {
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
				[[node]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });

				if (
					!node ||
					!isTokenNode(node) ||
					(
						isTokenNumeric(node.value) &&
						Number.isNaN(node.value[4].value)
					)
				) {
					return false;
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
	}

	if (colors.length !== 2) {
		return false;
	}

	let p1 = colors[0].percentage;
	let p2 = colors[1].percentage;

	if (p1 !== false && (p1 < 0 || p1 > 100)) {
		return false;
	}
	if (p2 !== false && (p2 < 0 || p2 > 100)) {
		return false;
	}

	if (p1 === false && p2 === false) {
		p1 = 50;
		p2 = 50;
	} else if (p1 !== false && p2 === false) {
		p2 = 100 - p1;
	} else if (p1 === false && p2 !== false) {
		p1 = 100 - p2;
	}

	if (p1 === 0 && p2 === 0) {
		return false;
	}

	if (p1 === false || p2 === false) {
		return false;
	}

	if ((p1 + p2) > 100) {
		p1 = p1 / (p1 + p2) * 100;
		p2 = p2 / (p1 + p2) * 100;
	}

	if ((p1 + p2) < 100) {
		alphaMultiplier = (p1 + p2) / 100;

		p1 = p1 / (p1 + p2) * 100;
		p2 = p2 / (p1 + p2) * 100;
	}

	return {
		a: {
			color: colors[0].color,
			percentage: p1,
		},
		b: {
			color: colors[1].color,
			percentage: p2,
		},
		alphaMultiplier: alphaMultiplier,
	};
}

function colorMixRectangular(colorSpace: string, colors: ColorMixColors | false): ColorData | false {
	if (!colors) {
		return false;
	}

	const a_color = colors.a.color;
	const b_color = colors.b.color;

	const ratio = colors.a.percentage / 100;

	let a_channels = a_color.channels;
	let b_channels = b_color.channels;

	let outputColorNotation: ColorNotation = ColorNotation.RGB;

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
			break;
	}

	a_channels = colorDataTo(a_color, outputColorNotation).channels;
	b_channels = colorDataTo(b_color, outputColorNotation).channels;

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
		colorNotation: outputColorNotation,
		channels: outputChannels,
		alpha: alpha * colors.alphaMultiplier,
		syntaxFlags: (new Set([SyntaxFlag.ColorMix])),
	};

	if (
		colors.a.color.syntaxFlags.has(SyntaxFlag.Experimental) ||
		colors.b.color.syntaxFlags.has(SyntaxFlag.Experimental)
	) {
		colorData.syntaxFlags.add(SyntaxFlag.Experimental);
	}

	return colorData;
}

function colorMixPolar(colorSpace: string, hueInterpolationMethod: string, colors: ColorMixColors | false): ColorData | false {
	if (!colors) {
		return false;
	}

	const a_color = colors.a.color;
	const b_color = colors.b.color;

	const ratio = colors.a.percentage / 100;

	let a_channels = a_color.channels;
	let b_channels = b_color.channels;

	let a_hue = 0;
	let b_hue = 0;

	let a_first = 0;
	let b_first = 0;

	let a_second = 0;
	let b_second = 0;

	let outputColorNotation: ColorNotation = ColorNotation.RGB;

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
			break;
	}

	a_channels = colorDataTo(a_color, outputColorNotation).channels;
	b_channels = colorDataTo(b_color, outputColorNotation).channels;

	switch (colorSpace) {
		case 'hsl':
		case 'hwb':
			a_hue = a_channels[0];
			b_hue = b_channels[0];

			a_first = a_channels[1];
			b_first = b_channels[1];

			a_second = a_channels[2];
			b_second = b_channels[2];

			break;
		case 'lch':
		case 'oklch':
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

	switch (colorSpace) {
		case 'hsl':
		case 'hwb':
			outputChannels = [
				interpolate(a_hue, b_hue, ratio),
				un_premultiply(interpolate(a_first, b_first, ratio), alpha),
				un_premultiply(interpolate(a_second, b_second, ratio), alpha),
			];

			break;
		case 'lch':
		case 'oklch':
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
		colorNotation: outputColorNotation,
		channels: outputChannels,
		alpha: alpha * colors.alphaMultiplier,
		syntaxFlags: (new Set([SyntaxFlag.ColorMix])),
	};

	if (
		colors.a.color.syntaxFlags.has(SyntaxFlag.Experimental) ||
		colors.b.color.syntaxFlags.has(SyntaxFlag.Experimental)
	) {
		colorData.syntaxFlags.add(SyntaxFlag.Experimental);
	}

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
		return NaN;
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
		return NaN;
	}

	return x / alpha;
}
