import type { Color } from '@csstools/color-helpers';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { ColorNotation } from './color-notation';
import { NumberType, TokenNumber, TokenType } from '@csstools/css-tokenizer';
import { HSL_to_XYZ_D50, HWB_to_XYZ_D50, LCH_to_XYZ_D50, Lab_to_XYZ_D50, OKLCH_to_XYZ_D50, OKLab_to_XYZ_D50, P3_to_XYZ_D50, ProPhoto_RGB_to_XYZ_D50, XYZ_D50_to_HSL, XYZ_D50_to_HWB, XYZ_D50_to_LCH, XYZ_D50_to_Lab, XYZ_D50_to_OKLCH, XYZ_D50_to_OKLab, XYZ_D50_to_P3, XYZ_D50_to_ProPhoto, XYZ_D50_to_XYZ_D50, XYZ_D50_to_XYZ_D65, XYZ_D50_to_a98_RGB, XYZ_D50_to_lin_sRGB, XYZ_D50_to_rec_2020, XYZ_D50_to_sRGB, XYZ_D65_to_XYZ_D50, a98_RGB_to_XYZ_D50, lin_sRGB_to_XYZ_D50, rec_2020_to_XYZ_D50, sRGB_to_XYZ_D50 } from '@csstools/color-helpers';

/**
 * A color data object.
 * It contains as much information as possible about the color and the original parsed syntax.
 */
export interface ColorData {
	/**
	 * The color notation of the color data.
	 *
	 * We use "color notation" and not "color space" because these represent the original notation and not the actual color space.
	 * The actual color space is however always implied by the color notation.
	 */
	colorNotation: ColorNotation,
	/**
	 * The color channels.
	 * This is always an array of three numbers
	 * but the channels can only be interpreted by looking at the color notation.
	 */
	channels: Color,
	/**
	 * The alpha channel.
	 * This is either a number between `0` and `1` or a `ComponentValue` object.
	 *
	 * Since most computations are not dependent on the alpha channel,
	 * we allow things like `var(--some-alpha)` as an alpha channel value for most inputs.
	 */
	alpha: number | ComponentValue,
	/**
	 * Information about the original syntax.
	 */
	syntaxFlags: Set<SyntaxFlag>
}

export enum SyntaxFlag {
	/** Is a color keyword, e.g. `transparent`, `currentColor`, ... */
	ColorKeyword = 'color-keyword',
	/** Has an explicit alpha channel */
	HasAlpha = 'has-alpha',
	/** Has a channel with a dimension value, e.g. `50deg` */
	HasDimensionValues = 'has-dimension-values',
	/** Has a channel with the `none` keyword */
	HasNoneKeywords = 'has-none-keywords',
	/** Has a channel with a number value */
	HasNumberValues = 'has-number-values',
	/** Has an alpha channel with a percentage value */
	HasPercentageAlpha = 'has-percentage-alpha',
	/** Has a channel with a percentage value */
	HasPercentageValues = 'has-percentage-values',
	/** Has an alpha channel with a `var()` function value */
	HasVariableAlpha = 'has-variable-alpha',
	/** Is Hex notation */
	Hex = 'hex',
	/** Is legacy HSL, e.g. `hsl(50deg, 0%, 0%)` */
	LegacyHSL = 'legacy-hsl',
	/** Is legacy RGB, e.g. `rgb(0, 0, 0)` */
	LegacyRGB = 'legacy-rgb',
	/** Is a named color, e.g. `red`, `blue` */
	NamedColor = 'named-color',
	/** Is a relative color syntax, e.g. `rgb(from purple r g b)` */
	RelativeColorSyntax = 'relative-color-syntax',
	/** Is a mixed color, e.g. `color-mix(in oklch, red, blue)` */
	ColorMix = 'color-mix',
	/** Is a contrasting color, e.g. `contrast-color()` */
	ContrastColor = 'contrast-color',
	/** Is an experimental color syntax */
	Experimental = 'experimental',
}

export function colorData_to_XYZ_D50(colorData: ColorData): ColorData {
	switch (colorData.colorNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB:
		case ColorNotation.sRGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: sRGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.Linear_sRGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: lin_sRGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.Display_P3:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: P3_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.Rec2020:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: rec_2020_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.A98_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: a98_RGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.ProPhoto_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: ProPhoto_RGB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.HSL:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: HSL_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.HWB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: HWB_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.Lab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: Lab_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.OKLab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: OKLab_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.LCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: LCH_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.OKLCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: OKLCH_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.XYZ_D50:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: XYZ_D50_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		case ColorNotation.XYZ_D65:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: XYZ_D65_to_XYZ_D50(colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color),
			};
		default:
			throw new Error('Unsupported color notation');
	}
}

const predefinedRGB_or_XYZ_Spaces = new Set([
	ColorNotation.A98_RGB,
	ColorNotation.Display_P3,
	ColorNotation.HEX,
	ColorNotation.Linear_sRGB,
	ColorNotation.ProPhoto_RGB,
	ColorNotation.RGB,
	ColorNotation.sRGB,
	ColorNotation.Rec2020,
	ColorNotation.XYZ_D50,
	ColorNotation.XYZ_D65,
]);

export function colorDataTo(colorData: ColorData, toNotation: ColorNotation): ColorData {
	const outputColorData: ColorData = {
		...colorData,
	};

	if (colorData.colorNotation !== toNotation) {
		const xyzColorData = colorData_to_XYZ_D50(outputColorData);

		// 1. Convert to destination color notation
		switch (toNotation) {
			case ColorNotation.HEX:
			case ColorNotation.RGB:
				outputColorData.colorNotation = ColorNotation.RGB;
				outputColorData.channels = XYZ_D50_to_sRGB(xyzColorData.channels);
				break;
			case ColorNotation.sRGB:
				outputColorData.colorNotation = ColorNotation.sRGB;
				outputColorData.channels = XYZ_D50_to_sRGB(xyzColorData.channels);
				break;
			case ColorNotation.Linear_sRGB:
				outputColorData.colorNotation = ColorNotation.Linear_sRGB;
				outputColorData.channels = XYZ_D50_to_lin_sRGB(xyzColorData.channels);
				break;
			case ColorNotation.Display_P3:
				outputColorData.colorNotation = ColorNotation.Display_P3;
				outputColorData.channels = XYZ_D50_to_P3(xyzColorData.channels);
				break;
			case ColorNotation.Rec2020:
				outputColorData.colorNotation = ColorNotation.Rec2020;
				outputColorData.channels = XYZ_D50_to_rec_2020(xyzColorData.channels);
				break;
			case ColorNotation.ProPhoto_RGB:
				outputColorData.colorNotation = ColorNotation.ProPhoto_RGB;
				outputColorData.channels = XYZ_D50_to_ProPhoto(xyzColorData.channels);
				break;
			case ColorNotation.A98_RGB:
				outputColorData.colorNotation = ColorNotation.A98_RGB;
				outputColorData.channels = XYZ_D50_to_a98_RGB(xyzColorData.channels);
				break;
			case ColorNotation.HSL:
				outputColorData.colorNotation = ColorNotation.HSL;
				outputColorData.channels = XYZ_D50_to_HSL(xyzColorData.channels);
				break;
			case ColorNotation.HWB:
				outputColorData.colorNotation = ColorNotation.HWB;
				outputColorData.channels = XYZ_D50_to_HWB(xyzColorData.channels);
				break;
			case ColorNotation.Lab:
				outputColorData.colorNotation = ColorNotation.Lab;
				outputColorData.channels = XYZ_D50_to_Lab(xyzColorData.channels);
				break;
			case ColorNotation.LCH:
				outputColorData.colorNotation = ColorNotation.LCH;
				outputColorData.channels = XYZ_D50_to_LCH(xyzColorData.channels);
				break;
			case ColorNotation.OKLCH:
				outputColorData.colorNotation = ColorNotation.OKLCH;
				outputColorData.channels = XYZ_D50_to_OKLCH(xyzColorData.channels);
				break;
			case ColorNotation.OKLab:
				outputColorData.colorNotation = ColorNotation.OKLab;
				outputColorData.channels = XYZ_D50_to_OKLab(xyzColorData.channels);
				break;
			case ColorNotation.XYZ_D50:
				outputColorData.colorNotation = ColorNotation.XYZ_D50;
				outputColorData.channels = XYZ_D50_to_XYZ_D50(xyzColorData.channels);
				break;
			case ColorNotation.XYZ_D65:
				outputColorData.colorNotation = ColorNotation.XYZ_D65;
				outputColorData.channels = XYZ_D50_to_XYZ_D65(xyzColorData.channels);
				break;
			default:
				throw new Error('Unsupported color notation');
		}
	} else {
		outputColorData.channels = colorData.channels.map((x) => Number.isNaN(x) ? 0 : x) as Color;
	}

	// 2. Carry forward missing components
	if (toNotation === colorData.colorNotation) {
		outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
	} else if (
		predefinedRGB_or_XYZ_Spaces.has(toNotation) &&
		predefinedRGB_or_XYZ_Spaces.has(colorData.colorNotation)
	) {
		outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
	} else {
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
						outputColorData.channels = carryForwardMissingComponents(colorData.channels, [0, 1, 2], outputColorData.channels, [0, 1, 2]);
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
	}

	outputColorData.channels = convertPowerlessComponentsToMissingComponents(outputColorData.channels, toNotation);

	return outputColorData;
}

function convertPowerlessComponentsToMissingComponents(a: Color, colorNotation: ColorNotation): Color {
	const out: Color = [...a];

	switch (colorNotation) {
		case ColorNotation.HSL:
			if (!Number.isNaN(out[1]) && reducePrecision(out[1], 4) <= 0) {
				out[0] = NaN;
			}

			break;
		case ColorNotation.HWB:
			if ((Math.max(0, reducePrecision(out[1], 4)) + Math.max(0, reducePrecision(out[2], 4))) >= 100) {
				out[0] = NaN;
			}

			break;
		case ColorNotation.LCH:
			if (!Number.isNaN(out[1]) && reducePrecision(out[1], 4) <= 0) {
				out[2] = NaN;
			}

			break;
		case ColorNotation.OKLCH:
			if (!Number.isNaN(out[1]) && reducePrecision(out[1], 6) <= 0) {
				out[2] = NaN;
			}

			break;
	}

	return out;
}

export function convertPowerlessComponentsToZeroValuesForDisplay(a: Color, colorNotation: ColorNotation): Color {
	const out: Color = [...a];

	switch (colorNotation) {
		case ColorNotation.HSL:
			if (reducePrecision(out[2]) <= 0 || reducePrecision(out[2]) >= 100) {
				out[0] = NaN;
				out[1] = NaN;
			}

			if (reducePrecision(out[1]) <= 0) {
				out[0] = NaN;
			}

			break;
		case ColorNotation.HWB:
			if ((Math.max(0, reducePrecision(out[1])) + Math.max(0, reducePrecision(out[2]))) >= 100) {
				out[0] = NaN;
			}
			break;
		case ColorNotation.Lab:
			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 100) {
				out[1] = NaN;
				out[2] = NaN;
			}
			break;
		case ColorNotation.LCH:
			if (reducePrecision(out[1]) <= 0) {
				out[2] = NaN;
			}

			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 100) {
				out[1] = NaN;
				out[2] = NaN;
			}
			break;
		case ColorNotation.OKLab:
			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 1) {
				out[1] = NaN;
				out[2] = NaN;
			}
			break;
		case ColorNotation.OKLCH:
			if (reducePrecision(out[1]) <= 0) {
				out[2] = NaN;
			}

			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 1) {
				out[1] = NaN;
				out[2] = NaN;
			}
			break;
	}

	return out;
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

export function normalizeRelativeColorDataChannels(x: ColorData): Map<string, TokenNumber> {
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
		case ColorNotation.HSL:
			globals.set('h', dummyNumberToken(x.channels[0]));
			globals.set('s', dummyNumberToken(x.channels[1]));
			globals.set('l', dummyNumberToken(x.channels[2]));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		case ColorNotation.HWB:
			globals.set('h', dummyNumberToken(x.channels[0]));
			globals.set('w', dummyNumberToken(x.channels[1]));
			globals.set('b', dummyNumberToken(x.channels[2]));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		case ColorNotation.Lab:
		case ColorNotation.OKLab:
			globals.set('l', dummyNumberToken(x.channels[0]));
			globals.set('a', dummyNumberToken(x.channels[1]));
			globals.set('b', dummyNumberToken(x.channels[2]));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		case ColorNotation.LCH:
		case ColorNotation.OKLCH:
			globals.set('l', dummyNumberToken(x.channels[0]));
			globals.set('c', dummyNumberToken(x.channels[1]));
			globals.set('h', dummyNumberToken(x.channels[2]));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		case ColorNotation.sRGB:
		case ColorNotation.A98_RGB:
		case ColorNotation.Display_P3:
		case ColorNotation.Rec2020:
		case ColorNotation.Linear_sRGB:
		case ColorNotation.ProPhoto_RGB:
			globals.set('r', dummyNumberToken(x.channels[0]));
			globals.set('g', dummyNumberToken(x.channels[1]));
			globals.set('b', dummyNumberToken(x.channels[2]));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		case ColorNotation.XYZ_D50:
		case ColorNotation.XYZ_D65:
			globals.set('x', dummyNumberToken(x.channels[0]));
			globals.set('y', dummyNumberToken(x.channels[1]));
			globals.set('z', dummyNumberToken(x.channels[2]));

			if (typeof x.alpha === 'number') {
				globals.set('alpha', dummyNumberToken(x.alpha));
			}

			break;
		default:
			break;
	}

	return globals;
}

export function noneToZeroInRelativeColorDataChannels(x: Map<string, TokenNumber>): Map<string, TokenNumber> {
	const globals: Map<string, TokenNumber> = new Map(x);

	for (const [key, value] of x) {
		if (Number.isNaN(value[4].value)) {
			globals.set(key, dummyNumberToken(0));
		}
	}

	return globals;
}

function dummyNumberToken(x: number): TokenNumber {
	return [TokenType.Number, x.toString(), -1, -1, { value: x, type: NumberType.Number }];
}

function reducePrecision(x: number, precision = 7): number {
	if (Number.isNaN(x)) {
		return 0;
	}

	const factor = Math.pow(10, precision);
	return Math.round(x * factor) / factor;
}

/**
 * Check if a color data object fits the `sRGB` gamut.
 *
 * @param {ColorData} x - The color data to be checked.
 * @returns {boolean} Whether the color data fits the `sRGB` gamut.
 */
export function colorDataFitsRGB_Gamut(x: ColorData): boolean {
	const copy: ColorData = {
		...x,
		channels: [
			...x.channels,
		],
	};

	copy.channels = convertPowerlessComponentsToZeroValuesForDisplay(copy.channels, copy.colorNotation);
	const srgb = colorDataTo(copy, ColorNotation.RGB);
	if (!srgb.channels.find((y: number) => y < -0.00001 || y > 1.00001)) {
		return true;
	}

	return false;
}

/**
 * Check if a color data object fits the `display-p3` gamut.
 *
 * @param {ColorData} x - The color data to be checked.
 * @returns {boolean} Whether the color data fits the `display-p3` gamut.
 */
export function colorDataFitsDisplayP3_Gamut(x: ColorData): boolean {
	const copy: ColorData = {
		...x,
		channels: [
			...x.channels,
		],
	};

	copy.channels = convertPowerlessComponentsToZeroValuesForDisplay(copy.channels, copy.colorNotation);
	const displayP3 = colorDataTo(copy, ColorNotation.Display_P3);
	if (!displayP3.channels.find((y: number) => y < -0.00001 || y > 1.00001)) {
		return true;
	}

	return false;
}
