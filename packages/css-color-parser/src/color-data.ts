import { Color, xyz } from '@csstools/color-helpers';
import { ColorNotation } from './color-notation';
import { NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { ComponentValue } from '@csstools/css-parser-algorithms';

export type ColorData = {
	colorNotation: ColorNotation,
	channels: Color,
	alpha: number | ComponentValue,
	syntaxFlags: Set<SyntaxFlag>
}

export enum SyntaxFlag {
	ColorKeyword = 'color-keyword',
	HasAlpha = 'has-alpha',
	HasDimensionValues = 'has-dimension-values',
	HasNoneKeywords = 'has-none-keywords',
	HasNumberValues = 'has-number-values',
	HasPercentageAlpha = 'has-percentage-alpha',
	HasPercentageValues = 'has-percentage-values',
	HasVariableAlpha = 'has-variable-alpha',
	Hex = 'hex',
	LegacyHSL = 'legacy-hsl',
	LegacyRGB = 'legacy-rgb',
	NamedColor = 'named-color',
	RelativeColorSyntax = 'relative-color-syntax',
	ColorMix = 'color-mix',
}

export function colorData_to_XYZ_D50(colorData: ColorData): ColorData {
	switch (colorData.colorNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.sRGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.Linear_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.lin_sRGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.Display_P3:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.P3_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.Rec2020:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.rec_2020_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.A98_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.a98_RGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.ProPhoto_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.proPhoto_RGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.HSL:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.HSL_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.HWB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.HWB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.Lab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.Lab_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.OKLab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.OKLab_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.LCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.LCH_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.OKLCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.OKLCH_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.XYZ_D50:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.XYZ_D50_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		case ColorNotation.XYZ_D65:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: xyz.XYZ_D65_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x)),
			};
		default:
			throw new Error('Unsupported color notation');
	}
}

const predefinedRGB_or_XYZ_Spaces = new Set([
	ColorNotation.A98_RGB,
	ColorNotation.Display_P3,
	ColorNotation.HEX,
	ColorNotation.Linear_RGB,
	ColorNotation.ProPhoto_RGB,
	ColorNotation.RGB,
	ColorNotation.Rec2020,
	ColorNotation.XYZ_D50,
	ColorNotation.XYZ_D65,
]);

export function colorDataTo(colorData: ColorData, toNotation: ColorNotation): ColorData {
	const xyzColorData = colorData_to_XYZ_D50(colorData);
	const outputColorData: ColorData = {
		...colorData,
	};

	switch (toNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB:
			outputColorData.colorNotation = ColorNotation.RGB;
			outputColorData.channels = xyz.XYZ_D50_to_sRGB(xyzColorData.channels);
			break;
		case ColorNotation.Linear_RGB:
			outputColorData.colorNotation = ColorNotation.Linear_RGB;
			outputColorData.channels = xyz.XYZ_D50_to_lin_sRGB(xyzColorData.channels);
			break;
		case ColorNotation.HSL:
			outputColorData.colorNotation = ColorNotation.HSL;
			outputColorData.channels = xyz.XYZ_D50_to_HSL(xyzColorData.channels);
			break;
		case ColorNotation.HWB:
			outputColorData.colorNotation = ColorNotation.HWB;
			outputColorData.channels = xyz.XYZ_D50_to_HWB(xyzColorData.channels);
			break;
		case ColorNotation.Lab:
			outputColorData.colorNotation = ColorNotation.Lab;
			outputColorData.channels = xyz.XYZ_D50_to_Lab(xyzColorData.channels);
			break;
		case ColorNotation.LCH:
			outputColorData.colorNotation = ColorNotation.LCH;
			outputColorData.channels = xyz.XYZ_D50_to_LCH(xyzColorData.channels);
			break;
		case ColorNotation.XYZ_D50:
			outputColorData.colorNotation = ColorNotation.XYZ_D50;
			outputColorData.channels = xyz.XYZ_D50_to_XYZ_D50(xyzColorData.channels);
			break;
		case ColorNotation.XYZ_D65:
			outputColorData.colorNotation = ColorNotation.XYZ_D65;
			outputColorData.channels = xyz.XYZ_D50_to_XYZ_D65(xyzColorData.channels);
			break;
		case ColorNotation.Display_P3:
			outputColorData.colorNotation = ColorNotation.Display_P3;
			outputColorData.channels = xyz.XYZ_D50_to_P3(xyzColorData.channels);
			break;
		case ColorNotation.OKLCH:
			outputColorData.colorNotation = ColorNotation.OKLCH;
			outputColorData.channels = xyz.XYZ_D50_to_OKLCH(xyzColorData.channels);
			break;
		case ColorNotation.OKLab:
			outputColorData.colorNotation = ColorNotation.OKLab;
			outputColorData.channels = xyz.XYZ_D50_to_OKLab(xyzColorData.channels);
			break;
	}

	if (toNotation === colorData.colorNotation) {
		outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
		return outputColorData;
	}

	if (
		predefinedRGB_or_XYZ_Spaces.has(toNotation) &&
		predefinedRGB_or_XYZ_Spaces.has(colorData.colorNotation)
	) {
		outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
		return outputColorData;
	}

	switch (toNotation) {
		case ColorNotation.HSL:
			switch (colorData.colorNotation) {
				case ColorNotation.HWB:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [0]);
					break;
				case ColorNotation.Lab:
				case ColorNotation.OKLab:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [2], outputColorData.channels, [0]);
					break;
				case ColorNotation.LCH:
				case ColorNotation.OKLCH:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [2, 1, 0]);
					break;
			}

			break;
		case ColorNotation.HWB:
			switch (colorData.colorNotation) {
				case ColorNotation.HSL:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [0]);
					break;
				case ColorNotation.LCH:
				case ColorNotation.OKLCH:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [2]);
					break;
			}

			break;
		case ColorNotation.Lab:
		case ColorNotation.OKLab:
			switch (colorData.colorNotation) {
				case ColorNotation.HSL:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [2]);
					break;
				case ColorNotation.Lab:
				case ColorNotation.OKLab:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [0]);
					break;
				case ColorNotation.LCH:
				case ColorNotation.OKLCH:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [0]);
					break;
			}

			break;
		case ColorNotation.LCH:
		case ColorNotation.OKLCH:
			switch (colorData.colorNotation) {
				case ColorNotation.HSL:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [2, 1, 0]);
					break;
				case ColorNotation.HWB:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [2]);
					break;
				case ColorNotation.Lab:
				case ColorNotation.OKLab:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [0]);
					break;
				case ColorNotation.LCH:
				case ColorNotation.OKLCH:
					outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
					break;
			}

			break;
	}

	return outputColorData;
}

function carryForwardMissingComponents(a: Color, aIndices: Array<number>, b: Color, bIndices: Array<number>): Color {
	const output: Color = [...b];

	for (const i of aIndices) {
		if (Number.isNaN(a[aIndices[i]])) {
			output[bIndices[i]] = NaN;
		}
	}

	return output;
}

export function fillInMissingComponents(a: Color, b: Color): Color {
	const output: Color = [...a];

	for (let i = 0; i < a.length; i++) {
		if (Number.isNaN(a[i])) {
			output[i] = b[i];
		}
	}

	return output;
}

export function colorDataChannelsToCalcGlobals(x: ColorData): Map<string, TokenNumber> {
	const globals: Map<string, TokenNumber> = new Map();

	switch (x.colorNotation) {
		case ColorNotation.RGB:
		case ColorNotation.HEX:
			globals.set('r', dummyNumberToken(x.channels[0] * 255));
			globals.set('g', dummyNumberToken(x.channels[1] * 255));
			globals.set('b', dummyNumberToken(x.channels[2] * 255));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		default:
			break;
	}

	return globals;
}

function dummyNumberToken(x: number): TokenNumber {
	return [TokenType.Number, x.toString(), -1, -1, { value: x, type: NumberType.Number }];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function colorDataToColorNotation(x: ColorData | false, colorNotation: ColorNotation): ColorData | false {
	if (x === false) {
		return false;
	}

	return false;
}
