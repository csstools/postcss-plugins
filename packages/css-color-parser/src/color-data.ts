import type { Color } from '@csstools/color-helpers';
import type { ComponentValue } from '@csstools/css-parser-algorithms';
import { ColorNotation } from './color-notation';
import type { TokenNumber} from '@csstools/css-tokenizer';
import { NumberType, TokenType } from '@csstools/css-tokenizer';
import { HSL_to_XYZ_D50, HSL_to_XYZ_D65, HWB_to_XYZ_D50, HWB_to_XYZ_D65, LCH_to_XYZ_D50, LCH_to_XYZ_D65, Lab_to_XYZ_D50, Lab_to_XYZ_D65, OKLCH_to_XYZ_D50, OKLCH_to_XYZ_D65, OKLab_to_XYZ_D50, OKLab_to_XYZ_D65, P3_to_XYZ_D50, P3_to_XYZ_D65, ProPhoto_RGB_to_XYZ_D50, ProPhoto_RGB_to_XYZ_D65, XYZ_D50_to_LCH, XYZ_D50_to_Lab, XYZ_D50_to_ProPhoto, XYZ_D50_to_XYZ_D50, XYZ_D50_to_XYZ_D65, XYZ_D65_to_HSL, XYZ_D65_to_HWB, XYZ_D65_to_OKLCH, XYZ_D65_to_OKLab, XYZ_D65_to_P3, XYZ_D65_to_XYZ_D50, XYZ_D65_to_XYZ_D65, XYZ_D65_to_a98_RGB, XYZ_D65_to_lin_P3, XYZ_D65_to_lin_sRGB, XYZ_D65_to_rec_2020, XYZ_D65_to_sRGB, a98_RGB_to_XYZ_D50, a98_RGB_to_XYZ_D65, lin_P3_to_XYZ_D50, lin_P3_to_XYZ_D65, lin_sRGB_to_XYZ_D50, lin_sRGB_to_XYZ_D65, rec_2020_to_XYZ_D50, rec_2020_to_XYZ_D65, sRGB_to_XYZ_D50, sRGB_to_XYZ_D65 } from '@csstools/color-helpers';

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

export function convertNaNToZero(x: Color): Color {
	return [
		Number.isNaN(x[0]) ? 0 : x[0],
		Number.isNaN(x[1]) ? 0 : x[1],
		Number.isNaN(x[2]) ? 0 : x[2],
	];
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
	/** Is a variadic mixed color, e.g. `color-mix(in oklch, red)` `color-mix(in oklch, red, blue, green)` */
	ColorMixVariadic = 'color-mix-variadic',
	/** Is a contrasting color, e.g. `contrast-color()` */
	ContrastColor = 'contrast-color',
	/** Is a relative alpha syntax `alpha(from red / 0.5)` */
	RelativeAlphaSyntax = 'relative-alpha-syntax',
	/** Is an experimental color syntax */
	Experimental = 'experimental',
}

function colorData_to_XYZ_D50(colorData: ColorData): ColorData {
	// https://drafts.csswg.org/css-color-4/#color-conversion
	// 2. Replace any missing component with zero.
	// 3. If src is not a linear-light representation, convert it to linear light (undo gamma-encoding) and let this be the new col1.
	// 4. Convert col1 to CIE XYZ with a given whitepoint src-white and let this be xyz.
	// 5. If dest-white is not the same as src-white, chromatically adapt xyz to dest-white using a linear Bradford chromatic adaptation transform, and let this be the new xyz.

	switch (colorData.colorNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB:
		case ColorNotation.sRGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: sRGB_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Linear_sRGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: lin_sRGB_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Display_P3:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: P3_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Linear_Display_P3:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: lin_P3_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Rec2020:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: rec_2020_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.A98_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: a98_RGB_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.ProPhoto_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: ProPhoto_RGB_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.HSL:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: HSL_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.HWB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: HWB_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Lab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: Lab_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.OKLab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: OKLab_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.LCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: LCH_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.OKLCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: OKLCH_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.XYZ_D50:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: XYZ_D50_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.XYZ_D65:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D50,
				channels: XYZ_D65_to_XYZ_D50(convertNaNToZero(colorData.channels)),
			};
		default:
			throw new Error('Unsupported color notation');
	}
}

export function colorData_to_XYZ_D65(colorData: ColorData): ColorData {
	// https://drafts.csswg.org/css-color-4/#color-conversion
	// 2. Replace any missing component with zero.
	// 3. If src is not a linear-light representation, convert it to linear light (undo gamma-encoding) and let this be the new col1.
	// 4. Convert col1 to CIE XYZ with a given whitepoint src-white and let this be xyz.
	// 5. If dest-white is not the same as src-white, chromatically adapt xyz to dest-white using a linear Bradford chromatic adaptation transform, and let this be the new xyz.

	switch (colorData.colorNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB:
		case ColorNotation.sRGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: sRGB_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Linear_sRGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: lin_sRGB_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Display_P3:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: P3_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Linear_Display_P3:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: lin_P3_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Rec2020:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: rec_2020_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.A98_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: a98_RGB_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.ProPhoto_RGB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: ProPhoto_RGB_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.HSL:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: HSL_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.HWB:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: HWB_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.Lab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: Lab_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.OKLab:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: OKLab_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.LCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: LCH_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.OKLCH:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: OKLCH_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.XYZ_D50:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: XYZ_D50_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		case ColorNotation.XYZ_D65:
			return {
				...colorData,
				colorNotation: ColorNotation.XYZ_D65,
				channels: XYZ_D65_to_XYZ_D65(convertNaNToZero(colorData.channels)),
			};
		default:
			throw new Error('Unsupported color notation');
	}
}

const predefinedRGB_or_XYZ_Spaces = new Set([
	ColorNotation.A98_RGB,
	ColorNotation.Display_P3,
	ColorNotation.Linear_Display_P3,
	ColorNotation.HEX,
	ColorNotation.Linear_sRGB,
	ColorNotation.ProPhoto_RGB,
	ColorNotation.RGB,
	ColorNotation.sRGB,
	ColorNotation.Rec2020,
	ColorNotation.XYZ_D50,
	ColorNotation.XYZ_D65,
]);

export function colorDataToForInterpolation(colorData: ColorData, toNotation: ColorNotation): ColorData {
	// https://drafts.csswg.org/css-color-4/#interpolation
	// 1. checking the two colors for analogous components and analogous sets which will be carried forward
	const originalChannelValues = [...colorData.channels] as Color;

	let outputColorData: ColorData = {
		...colorData,
	};

	// https://drafts.csswg.org/css-color-4/#interpolation
	// 2. changing any powerless components to missing values
	outputColorData.channels = convertPowerlessComponentsToMissingComponents(outputColorData.channels, colorData.colorNotation);

	// https://drafts.csswg.org/css-color-4/#interpolation
	// 3. converting them both to a given color space which will be referred to as the interpolation color space below.
	//
	// https://drafts.csswg.org/css-color-4/#color-conversion
	// To convert a color...
	// 1. -> 9.
	outputColorData = convertToDestination(outputColorData, toNotation);

	// https://drafts.csswg.org/css-color-4/#interpolation
	// 4. (if required) re-inserting carried forward values in the converted colors
	outputColorData.channels = carryForwardMissingComponentsForColorAndNotation(outputColorData, colorData.colorNotation, toNotation, originalChannelValues);

	return outputColorData;
}

export function colorDataToForRelativeColorSyntax(colorData: ColorData, toNotation: ColorNotation): ColorData {
	// https://drafts.csswg.org/css-color-5/#rcs-intro
	// Required conversion: All operations take part in the relative color processing space.
	// If the originally specified color space for the origin color used a different color function,
	// it’s first converted into the relative color processing space,
	// so it has meaningful values for the components,
	// and color component keywords refer to that color space.
	//
	// Therefore, if the specified color uses the same color function, then we return the origin color
	if (colorData.colorNotation === toNotation) {
		return {
			...colorData,
		};
	}

	// https://drafts.csswg.org/css-color-5/#rcs-intro
	// Missing components are handled the same way as with CSS Color 4 § 13.2 Interpolating with Missing Components:
	// the origin colorspace and the relative function colorspace are checked for analogous components which are then carried forward as missing.
	//
	// https://drafts.csswg.org/css-color-4/#interpolation
	// 1. checking the two colors for analogous components and analogous sets which will be carried forward
	const originalChannelValues = [...colorData.channels] as Color;

	let outputColorData: ColorData = {
		...colorData,
	};

	// https://drafts.csswg.org/css-color-4/#color-conversion
	// To prepare a color col1 for conversion:
	// 1. Change any powerless components in src to missing components
	outputColorData.channels = convertPowerlessComponentsToMissingComponents(outputColorData.channels, colorData.colorNotation);

	// https://drafts.csswg.org/css-color-4/#color-conversion
	// To convert a color...
	// 1. -> 9.
	outputColorData = convertToDestination(outputColorData, toNotation);

	// https://drafts.csswg.org/css-color-5/#rcs-intro
	// Missing components are handled the same way as with CSS Color 4 § 13.2 Interpolating with Missing Components:
	// the origin colorspace and the relative function colorspace are checked for analogous components which are then carried forward as missing.
	//
	// https://drafts.csswg.org/css-color-4/#interpolation
	// 4. (if required) re-inserting carried forward values in the converted colors
	outputColorData.channels = carryForwardMissingComponentsForColorAndNotation(outputColorData, colorData.colorNotation, toNotation, originalChannelValues);

	return outputColorData;
}

function convertToDestination(colorData: ColorData, toNotation: ColorNotation): ColorData {
	// If the input and output notation are the same,
	// the only result of going through the color space conversion is that missing components are set to `0` and that powerless components are set to missing
	if (colorData.colorNotation === toNotation) {
		// https://drafts.csswg.org/css-color-4/#color-conversion
		// 2. Replace any missing component with zero.
		colorData.channels = convertNaNToZero(colorData.channels);

		// https://drafts.csswg.org/css-color-4/#color-conversion
		// 9. This may produce missing components.
		colorData.channels = convertPowerlessComponentsToMissingComponents(colorData.channels, toNotation);
		return colorData;
	}

	// 1. Convert to destination color notation
	switch (toNotation) {
		case ColorNotation.HEX:
		case ColorNotation.RGB: {
			// https://drafts.csswg.org/css-color-4/#color-conversion
			// 1. -> 4.
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.RGB;

			// 6. If dest is a cylindrical polar color representation, let dest-rect be the corresponding rectangular orthogonal color representation. Otherwise, let dest-rect be dest.
			// 7. Convert xyz to dest, followed by applying any transfer function (gamma encoding), producing col2.
			// 8. (gamut mapping) does not apply here
			// 9. If dest-rect is not the same as dest, in other words dest is a cylindrical polar color representation, convert from dest-rect to dest, and let this be col2.
			colorData.channels = XYZ_D65_to_sRGB(xyzColorData.channels);
			colorData.channels = colorData.channels.map((x) => reducePrecisionOrNaN(x, 8)) as Color;
			break;
		}
		case ColorNotation.sRGB: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.sRGB;
			colorData.channels = XYZ_D65_to_sRGB(xyzColorData.channels);
			break;
		}
		case ColorNotation.Linear_sRGB: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.Linear_sRGB;
			colorData.channels = XYZ_D65_to_lin_sRGB(xyzColorData.channels);
			break;
		}
		case ColorNotation.Display_P3: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.Display_P3;
			colorData.channels = XYZ_D65_to_P3(xyzColorData.channels);
			break;
		}
		case ColorNotation.Linear_Display_P3: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.Linear_Display_P3;
			colorData.channels = XYZ_D65_to_lin_P3(xyzColorData.channels);
			break;
		}
		case ColorNotation.Rec2020: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.Rec2020;
			colorData.channels = XYZ_D65_to_rec_2020(xyzColorData.channels);
			break;
		}
		case ColorNotation.ProPhoto_RGB: {
			const xyzColorData = colorData_to_XYZ_D50(colorData);
			colorData.colorNotation = ColorNotation.ProPhoto_RGB;
			colorData.channels = XYZ_D50_to_ProPhoto(xyzColorData.channels);
			break;
		}
		case ColorNotation.A98_RGB: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.A98_RGB;
			colorData.channels = XYZ_D65_to_a98_RGB(xyzColorData.channels);
			break;
		}
		case ColorNotation.HSL: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.HSL;
			colorData.channels = XYZ_D65_to_HSL(xyzColorData.channels);
			colorData.channels = colorData.channels.map((x) => reducePrecisionOrNaN(x, 8)) as Color;

			// https://drafts.csswg.org/css-color-4/#color-conversion
			// 9. This may produce missing components.
			colorData.channels = convertPowerlessComponentsToMissingComponents(colorData.channels, toNotation);
			break;
		}
		case ColorNotation.HWB: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.HWB;
			colorData.channels = XYZ_D65_to_HWB(xyzColorData.channels);
			colorData.channels = colorData.channels.map((x) => reducePrecisionOrNaN(x, 8)) as Color;

			// https://drafts.csswg.org/css-color-4/#color-conversion
			// 9. This may produce missing components.
			colorData.channels = convertPowerlessComponentsToMissingComponents(colorData.channels, toNotation);
			break;
		}
		case ColorNotation.Lab: {
			const xyzColorData = colorData_to_XYZ_D50(colorData);
			colorData.colorNotation = ColorNotation.Lab;
			colorData.channels = XYZ_D50_to_Lab(xyzColorData.channels);
			break;
		}
		case ColorNotation.LCH: {
			const xyzColorData = colorData_to_XYZ_D50(colorData);
			colorData.colorNotation = ColorNotation.LCH;
			colorData.channels = XYZ_D50_to_LCH(xyzColorData.channels);

			// https://drafts.csswg.org/css-color-4/#color-conversion
			// 9. This may produce missing components.
			colorData.channels = convertPowerlessComponentsToMissingComponents(colorData.channels, toNotation);
			break;
		}
		case ColorNotation.OKLCH: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.OKLCH;
			colorData.channels = XYZ_D65_to_OKLCH(xyzColorData.channels);

			// https://drafts.csswg.org/css-color-4/#color-conversion
			// 9. This may produce missing components.
			colorData.channels = convertPowerlessComponentsToMissingComponents(colorData.channels, toNotation);
			break;
		}
		case ColorNotation.OKLab: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.OKLab;
			colorData.channels = XYZ_D65_to_OKLab(xyzColorData.channels);
			break;
		}
		case ColorNotation.XYZ_D50: {
			const xyzColorData = colorData_to_XYZ_D50(colorData);
			colorData.colorNotation = ColorNotation.XYZ_D50;
			colorData.channels = XYZ_D50_to_XYZ_D50(xyzColorData.channels);
			break;
		}
		case ColorNotation.XYZ_D65: {
			const xyzColorData = colorData_to_XYZ_D65(colorData);
			colorData.colorNotation = ColorNotation.XYZ_D65;
			colorData.channels = XYZ_D65_to_XYZ_D65(xyzColorData.channels);
			break;
		}
		default:
			throw new Error('Unsupported color notation');
	}

	return colorData;
}

function carryForwardMissingComponentsForColorAndNotation(colorData: ColorData, fromNotation: ColorNotation, toNotation: ColorNotation, originalChannelValues: Color): Color {
	if (fromNotation === toNotation) {
		return carryForwardMissingComponents(originalChannelValues, [0, 1, 2], [], colorData.channels, [0, 1, 2], []);
	} else if (
		predefinedRGB_or_XYZ_Spaces.has(toNotation) &&
		predefinedRGB_or_XYZ_Spaces.has(fromNotation)
	) {
		return carryForwardMissingComponents(originalChannelValues, [0, 1, 2], [], colorData.channels, [0, 1, 2], []);
	} else {
		switch (toNotation) {
			case ColorNotation.HSL:
				switch (fromNotation) {
					case ColorNotation.HWB:
						return carryForwardMissingComponents(
							// HWB
							originalChannelValues, [0], [1, 2],
							// HSL
							colorData.channels, [0], [1, 2]
						);
					case ColorNotation.Lab:
					case ColorNotation.OKLab:
						return carryForwardMissingComponents(
							// LAB
							originalChannelValues, [0], [1, 2],
							// HSL
							colorData.channels, [2], [0, 1]
						);
					case ColorNotation.LCH:
					case ColorNotation.OKLCH:
						return carryForwardMissingComponents(
							// LCH
							originalChannelValues, [0, 1, 2], [],
							// HSL
							colorData.channels, [2, 1, 0], []
						);
					default:
						return carryForwardMissingComponents(
							originalChannelValues, [], [],
							colorData.channels, [], []
						);
				}

			case ColorNotation.HWB:
				switch (fromNotation) {
					case ColorNotation.HSL:
						return carryForwardMissingComponents(
							// HSL
							originalChannelValues, [0], [1, 2],
							// HWB
							colorData.channels, [0], [1, 2]
						);
					case ColorNotation.LCH:
					case ColorNotation.OKLCH:
						return carryForwardMissingComponents(
							// LCH
							originalChannelValues, [2], [0, 1],
							// HWB
							colorData.channels, [0], [1, 2]
						);
					default:
						return carryForwardMissingComponents(
							originalChannelValues, [], [],
							colorData.channels, [], []
						);
				}

			case ColorNotation.Lab:
			case ColorNotation.OKLab:
				switch (fromNotation) {
					case ColorNotation.HSL:
						return carryForwardMissingComponents(
							// HSL
							originalChannelValues, [2], [0, 1],
							// LAB
							colorData.channels, [0], [1, 2]
						);
					case ColorNotation.Lab:
					case ColorNotation.OKLab:
						return carryForwardMissingComponents(
							// LAB
							originalChannelValues, [0, 1, 2], [],
							// LAB
							colorData.channels, [0, 1, 2], []
						);
					case ColorNotation.LCH:
					case ColorNotation.OKLCH:
						return carryForwardMissingComponents(
							// LCH
							originalChannelValues, [0], [1, 2],
							// LAB
							colorData.channels, [0], [1, 2]
						);
					default:
						return carryForwardMissingComponents(
							originalChannelValues, [], [],
							colorData.channels, [], []
						);
				}

			case ColorNotation.LCH:
			case ColorNotation.OKLCH:
				switch (fromNotation) {
					case ColorNotation.HSL:
						return carryForwardMissingComponents(
							// HSL
							originalChannelValues, [0, 1, 2], [],
							// LCH
							colorData.channels, [2, 1, 0], []
						);
					case ColorNotation.HWB:
						return carryForwardMissingComponents(
							// HWB
							originalChannelValues, [0], [1, 2],
							// LCH
							colorData.channels, [2], [0, 1]
						);
					case ColorNotation.Lab:
					case ColorNotation.OKLab:
						return carryForwardMissingComponents(
							// LAB
							originalChannelValues, [0], [1, 2],
							// LCH
							colorData.channels, [0], [1, 2]
						);
					case ColorNotation.LCH:
					case ColorNotation.OKLCH:
						return carryForwardMissingComponents(
							// LCH
							originalChannelValues, [0, 1, 2], [],
							// LCH
							colorData.channels, [0, 1, 2], []
						);
					default:
						return carryForwardMissingComponents(
							originalChannelValues, [], [],
							colorData.channels, [], []
						);
				}

			default:
				return carryForwardMissingComponents(
					originalChannelValues, [], [],
					colorData.channels, [], []
				);
		}
	}
}

function convertPowerlessComponentsToMissingComponents(a: Color, colorNotation: ColorNotation): Color {
	const out: Color = [...a];

	switch (colorNotation) {
		case ColorNotation.HSL:
			if ((Number.isNaN(out[1]) ? 0 : out[1]) <= 0.001) {
				out[0] = Number.NaN;

				if (!Number.isNaN(out[1]) && out[1] > 0) {
					out[1] = 0;
				}
			}

			break;
		case ColorNotation.HWB:
			if ((Math.max(0, (Number.isNaN(out[1]) ? 0 : out[1])) + Math.max(0, (Number.isNaN(out[2]) ? 0 : out[2]))) >= 99.999) {
				out[0] = Number.NaN;

				if ((Math.max(0, (Number.isNaN(out[1]) ? 0 : out[1])) + Math.max(0, (Number.isNaN(out[2]) ? 0 : out[2]))) < 100) {
					if (!Number.isNaN(out[1]) && !Number.isNaN(out[2])) {
						out[2] = 100 - out[1];
					} else if (!Number.isNaN(out[1])) {
						out[1] = 100;
					} else if (!Number.isNaN(out[2])) {
						out[2] = 100;
					}
				}
			}

			break;
		case ColorNotation.LCH:
			if ((Number.isNaN(out[1]) ? 0 : out[1]) <= 0.0015) {
				out[2] = Number.NaN;

				if (!Number.isNaN(out[1]) && out[1] > 0) {
					out[1] = 0;
				}
			}

			break;
		case ColorNotation.OKLCH:
			if ((Number.isNaN(out[1]) ? 0 : out[1]) <= 0.000004) {
				out[2] = Number.NaN;

				if (!Number.isNaN(out[1]) && out[1] > 0) {
					out[1] = 0;
				}
			}

			break;
	}

	return out;
}

export function convertPowerlessComponentsToZeroValuesForDisplay(a: Color, colorNotation: ColorNotation): Color {
	const out: Color = [...a];

	switch (colorNotation) {
		case ColorNotation.HSL:
			if ((Number.isNaN(out[1]) ? 0 : out[1]) <= 0.001) {
				out[0] = Number.NaN;
			}

			if (reducePrecision(out[2]) <= 0 || reducePrecision(out[2]) >= 100) {
				out[0] = Number.NaN;
				out[1] = Number.NaN;
			}

			break;
		case ColorNotation.HWB:
			if ((Math.max(0, (Number.isNaN(out[1]) ? 0 : out[1])) + Math.max(0, (Number.isNaN(out[2]) ? 0 : out[2]))) >= 99.999) {
				out[0] = Number.NaN;
			}
			break;
		case ColorNotation.Lab:
			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 100) {
				out[1] = Number.NaN;
				out[2] = Number.NaN;
			}
			break;
		case ColorNotation.LCH:
			if ((Number.isNaN(out[1]) ? 0 : out[1]) <= 0.0015) {
				out[2] = Number.NaN;
			}

			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 100) {
				out[1] = Number.NaN;
				out[2] = Number.NaN;
			}
			break;
		case ColorNotation.OKLab:
			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 1) {
				out[1] = Number.NaN;
				out[2] = Number.NaN;
			}
			break;
		case ColorNotation.OKLCH:
			if ((Number.isNaN(out[1]) ? 0 : out[1]) <= 0.000004) {
				out[2] = Number.NaN;
			}

			if (reducePrecision(out[0]) <= 0 || reducePrecision(out[0]) >= 1) {
				out[1] = Number.NaN;
				out[2] = Number.NaN;
			}
			break;
	}

	return out;
}

function carryForwardMissingComponents(a: Color, aIndices: Array<number>, aSet: Array<number>, b: Color, bIndices: Array<number>, bSet: Array<number>): Color {
	if (aIndices.length < 3 && a.every(Number.isNaN)) {
		return [Number.NaN, Number.NaN, Number.NaN];
	}

	const output: Color = [...b];

	for (let i = 0; i < aIndices.length; i++) {
		if (Number.isNaN(a[aIndices[i]])) {
			output[bIndices[i]] = Number.NaN;
		}
	}

	if (aSet.length && aSet.every((i) => Number.isNaN(a[i]))) {
		for (let i = 0; i < bSet.length; i++) {
			output[bSet[i]] = Number.NaN;
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
		case ColorNotation.Linear_Display_P3:
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
	if (Number.isNaN(x)) {
		return [TokenType.Number, 'none', -1, -1, { value: Number.NaN, type: NumberType.Number }];
	}

	return [TokenType.Number, x.toString(), -1, -1, { value: x, type: NumberType.Number }];
}

function reducePrecisionOrNaN(x: number, precision = 7): number {
	if (Number.isNaN(x)) {
		return x;
	}

	const factor = Math.pow(10, precision);
	return Math.round(x * factor) / factor;
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
	const srgb = colorDataToForRelativeColorSyntax(copy, ColorNotation.RGB);
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
	const displayP3 = colorDataToForRelativeColorSyntax(copy, ColorNotation.Display_P3);
	if (!displayP3.channels.find((y: number) => y < -0.00001 || y > 1.00001)) {
		return true;
	}

	return false;
}
