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
		default:
			throw new Error('Unsupported color notation');
	}
}

export function colorDataTo(colorData: ColorData, toNotation: ColorNotation): ColorData {
	const xyzColorData = colorData_to_XYZ_D50(colorData);
	switch (toNotation) {
		case ColorNotation.HSL: {
			const outputColorData: ColorData = {
				...colorData,
				colorNotation: ColorNotation.HSL,
				channels: xyz.XYZ_D50_to_HSL(xyzColorData.channels),
			};

			switch (colorData.colorNotation) {
				case ColorNotation.HSL:
					carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
					break;
				case ColorNotation.HWB:
					carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [0]);
					break;
				case ColorNotation.Lab:
					carryForwardMissingComponents(colorData.channels, [2], outputColorData.channels, [0]);
					break;
				default:
					break;
			}

			return outputColorData;
		}
		case ColorNotation.HWB: {
			const outputColorData: ColorData = {
				...colorData,
				colorNotation: ColorNotation.HWB,
				channels: xyz.XYZ_D50_to_HWB(xyzColorData.channels),
			};

			switch (colorData.colorNotation) {
				case ColorNotation.HSL:
					carryForwardMissingComponents(colorData.channels, [0], outputColorData.channels, [0]);
					break;
				case ColorNotation.HWB:
					carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
					break;
				default:
					break;
			}

			return outputColorData;
		}

		default:
			throw new Error('Unsupported color notation');
	}
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
