import { xyz } from '@csstools/color-helpers';
import { calcFromComponentValues } from '@csstools/css-calc';
import { ComponentValue, FunctionNode, isCommentNode, isFunctionNode, isTokenNode, isWhitespaceNode } from '@csstools/css-parser-algorithms';
import { TokenType } from '@csstools/css-tokenizer';
import { ColorData, SyntaxFlag } from '../color-data';
import type { ColorParser } from '../color-parser';
import { ColorSpace } from '../color-space';
import { toLowerCaseAZ } from '../util/to-lower-case-a-z';
import { normalize_HWB_ChannelValues } from './hwb-normalize-channel-values';
import { threeChannelSpaceSeparated } from './three-channel-space-separated';

const rectangularColorSpaces = new Set(['srgb', 'srgb-linear', 'lab', 'oklab', 'xyz', 'xyz-d50', 'xyz-d65']);
const polarColorSpaces = new Set(['hsl', 'hwb', 'lch', 'oklch']);
const hueInterpolationMethods = new Set(['shorter', 'longer', 'increasing', 'decreasing']);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
			node.value[0] === TokenType.Ident
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
			node.value[0] === TokenType.Comma
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
	const colors: Array<{color: ColorData, percentage: number | false}> = [];

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
			node.value[0] === TokenType.Comma
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
			if (!parsedColor) {
				return false;
			}

			color = parsedColor;
			continue;
		}

		if (
			!percentage
		) {
			if (
				isFunctionNode(node) &&
				toLowerCaseAZ(node.getName()) === 'calc'
			) {
				[[node]] = calcFromComponentValues([[node]], { toCanonicalUnits: true, precision: 100 });
			}

			if (
				isTokenNode(node) &&
				node.value[0] === TokenType.Percentage &&
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
		p1 = p1 / (p1 + p2) * 100;
		p2 = p2 / (p1 + p2) * 100;
		alphaMultiplier = (p1 + p2) / 100;
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

	return false;
}

function colorMixPolar(colorSpace: string, hueInterpolationMethod: string, colors: ColorMixColors | false): ColorData | false {
	if (!colors) {
		return false;
	}

	let a_channels = colors.a.color.channels;
	let b_channels = colors.b.color.channels;

	let a_hue_channel = 0;
	let b_hue_channel = 0;

	const a_alpha = colors.a.color.alpha;
	if (typeof a_alpha !== 'number') {
		return false;
	}
	const b_alpha = colors.b.color.alpha;
	if (typeof b_alpha !== 'number') {
		return false;
	}

	switch (colorSpace) {
		case 'hsl':
			a_channels = xyz.XYZ_D50_to_HSL(a_channels);
			b_channels = xyz.XYZ_D50_to_HSL(b_channels);

			a_hue_channel = a_channels[0];
			b_hue_channel = b_channels[0];
			break;

		default:
			break;
	}

	switch (hueInterpolationMethod) {
		case 'shorter':
			if (Math.abs(a_hue_channel - b_hue_channel) > 180) {
				if (a_hue_channel > b_hue_channel) {
					b_hue_channel += 360;
				} else {
					a_hue_channel += 360;
				}
			}

			break;

		default:
			break;
	}

	const hue = interpolate(a_hue_channel, b_hue_channel, colors.a.percentage / 100);
	const saturation = interpolate(a_channels[1], b_channels[1], colors.a.percentage / 100);
	const lightness = interpolate(a_channels[2], b_channels[2], colors.a.percentage / 100);
	const alpha = interpolate(a_alpha, b_alpha, colors.a.percentage / 100);

	const colorData: ColorData = {
		colorSpace: ColorSpace.XYZ_D50,
		channels: xyz.HSL_to_XYZ_D50([hue, saturation, lightness]),

		sourceColorSpace: ColorSpace.sRGB,
		alpha: alpha,
		missingComponents: [false, false, false, false],
		syntaxFlags: (new Set([SyntaxFlag.ColorMix])),
	};

	return colorData;
}

function interpolate(start: number, end: number, p: number) {
	if (isNaN(start)) {
		return end;
	}

	if (isNaN(end)) {
		return start;
	}

	return start + ((end - start) * p);
}
