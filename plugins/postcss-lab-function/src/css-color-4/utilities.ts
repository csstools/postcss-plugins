/**
 * @license W3C
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */

import { D50_to_D65, D65_to_D50, gam_2020, gam_P3, gam_sRGB, Lab_to_LCH, Lab_to_XYZ, LCH_to_Lab, lin_2020, lin_2020_to_XYZ, lin_P3, lin_P3_to_XYZ, lin_sRGB, lin_sRGB_to_XYZ, XYZ_to_Lab, XYZ_to_lin_2020, XYZ_to_lin_P3, XYZ_to_lin_sRGB } from './conversions';

type color = [number, number, number];

// utility functions for color conversions
// needs conversions.js

export function sRGB_to_luminance(RGB: color): number {
	// convert an array of gamma-corrected sRGB values
	// in the 0.0 to 1.0 range
	// to linear-light sRGB, then to CIE XYZ
	// and return luminance (the Y value)

	const XYZ = lin_sRGB_to_XYZ(lin_sRGB(RGB));
	return XYZ[1];
}

export function contrast(RGB1: color, RGB2: color): number {
	// return WCAG 2.1 contrast ratio
	// https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
	// for two sRGB values
	// given as arrays of 0.0 to 1.0

	const L1 = sRGB_to_luminance(RGB1);
	const L2 = sRGB_to_luminance(RGB2);

	if (L1 > L2) {
		return (L1 + 0.05) / (L2 + 0.05);
	}

	return (L2 + 0.05) / (L1 + 0.05);
}

export function sRGB_to_LCH(RGB: color): color {
	// convert an array of gamma-corrected sRGB values
	// in the 0.0 to 1.0 range
	// to linear-light sRGB, then to CIE XYZ,
	// then adapt from D65 to D50,
	// then convert XYZ to CIE Lab
	// and finally, convert to CIE LCH

	return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_sRGB_to_XYZ(lin_sRGB(RGB)))));
}

export function P3_to_LCH(RGB: color): color {
	// convert an array of gamma-corrected display-p3 values
	// in the 0.0 to 1.0 range
	// to linear-light display-p3, then to CIE XYZ,
	// then adapt from D65 to D50,
	// then convert XYZ to CIE Lab
	// and finally, convert to CIE LCH

	return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_P3_to_XYZ(lin_P3(RGB)))));
}

export function r2020_to_LCH(RGB: color): color {
	// convert an array of gamma-corrected rec.2020 values
	// in the 0.0 to 1.0 range
	// to linear-light sRGB, then to CIE XYZ,
	// then adapt from D65 to D50,
	// then convert XYZ to CIE Lab
	// and finally, convert to CIE LCH

	return Lab_to_LCH(XYZ_to_Lab(D65_to_D50(lin_2020_to_XYZ(lin_2020(RGB)))));
}

export function LCH_to_sRGB(LCH: color): color {
	// convert an array of CIE LCH values
	// to CIE Lab, and then to XYZ,
	// adapt from D50 to D65,
	// then convert XYZ to linear-light sRGB
	// and finally to gamma corrected sRGB
	// for in-gamut colors, components are in the 0.0 to 1.0 range
	// out of gamut colors may have negative components
	// or components greater than 1.0
	// so check for that :)

	return gam_sRGB(XYZ_to_lin_sRGB(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(LCH)))));
}

export function LCH_to_P3(LCH: color): color {
	// convert an array of CIE LCH values
	// to CIE Lab, and then to XYZ,
	// adapt from D50 to D65,
	// then convert XYZ to linear-light display-p3
	// and finally to gamma corrected display-p3
	// for in-gamut colors, components are in the 0.0 to 1.0 range
	// out of gamut colors may have negative components
	// or components greater than 1.0
	// so check for that :)

	return gam_P3(XYZ_to_lin_P3(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(LCH)))));
}

export function LCH_to_r2020(LCH: color): color {
	// convert an array of CIE LCH values
	// to CIE Lab, and then to XYZ,
	// adapt from D50 to D65,
	// then convert XYZ to linear-light rec.2020
	// and finally to gamma corrected rec.2020
	// for in-gamut colors, components are in the 0.0 to 1.0 range
	// out of gamut colors may have negative components
	// or components greater than 1.0
	// so check for that :)

	return gam_2020(XYZ_to_lin_2020(D50_to_D65(Lab_to_XYZ(LCH_to_Lab(LCH)))));
}

// this is straight from the CSS Color 4 spec

export function hslToRgb(hsl: color): color {
	// 	For simplicity, this algorithm assumes that the hue has been normalized
	//  to a number in the half-open range [0, 6), and the saturation and lightness
	//  have been normalized to the range [0, 1]. It returns an array of three numbers
	//  representing the red, green, and blue channels of the colors,
	//  normalized to the range [0, 1]
	const [hue, sat, light] = hsl;

	let t2: number;
	if (light <= .5) {
		t2 = light * (sat + 1);
	} else {
		t2 = light + sat - (light * sat);
	}
	const t1 = light * 2 - t2;
	const r = hueToRgb(t1, t2, hue + 2);
	const g = hueToRgb(t1, t2, hue);
	const b = hueToRgb(t1, t2, hue - 2);
	return [r, g, b];
}

export function hueToRgb(t1: number, t2: number, hue: number): number {
	if (hue < 0) {
		hue += 6;
	}
	if (hue >= 6) {
		hue -= 6;
	}

	if (hue < 1) {
		return (t2 - t1) * hue + t1;
	} else if (hue < 3) {
		return t2;
	} else if (hue < 4) {
		return (t2 - t1) * (4 - hue) + t1;
	} else {
		return t1;
	}
}

// These are the naive algorithms from CS Color 4

export function naive_CMYK_to_sRGB(CMYK: [number, number, number, number]): color {
	// CMYK is an array of four values
	// in the range [0.0, 1.0]
	// the optput is an array of [RGB]
	// also in the [0.0, 1.0] range
	// because the naive algorithm does not generate out of gamut colors
	// neither does it generate accurate simulations of practical CMYK colors

	const cyan = CMYK[0], magenta = CMYK[1], yellow = CMYK[2], black = CMYK[3];

	const red = 1 - Math.min(1, cyan * (1 - black) + black);
	const green = 1 - Math.min(1, magenta * (1 - black) + black);
	const blue = 1 - Math.min(1, yellow * (1 - black) + black);

	return [red, green, blue];

}

export function naive_sRGB_to_CMYK(RGB: color): [number, number, number, number] {
	// RGB is an arravy of three values
	// in the range [0.0, 1.0]
	// the output is an array of [CMYK]
	// also in the [0.0, 1.0] range
	// with maximum GCR and (I think) 200% TAC
	// the naive algorithm does not generate out of gamut colors
	// neither does it generate accurate simulations of practical CMYK colors

	const red = RGB[0], green = RGB[1], blue = RGB[2];

	const black = 1 - Math.max(red, green, blue);
	const cyan = (black == 1.0) ? 0 : (1 - red - black) / (1 - black);
	const magenta = (black == 1.0) ? 0 : (1 - green - black) / (1 - black);
	const yellow = (black == 1.0) ? 0 : (1 - blue - black) / (1 - black);

	return [cyan, magenta, yellow, black];
}

// Chromaticity utilities

export function XYZ_to_xy(XYZ: color): [number, number] {
	// Convert an array of three XYZ values
	// to x,y chromaticity coordinates

	const X = XYZ[0];
	const Y = XYZ[1];
	const Z = XYZ[2];
	const sum = X + Y + Z;
	return [X / sum, Y / sum];
}

export function xy_to_uv(xy: [number, number]): [number, number] {
	// convert an x,y chromaticity pair
	// to u*,v* chromaticities

	const x = xy[0];
	const y = xy[1];
	const denom = -2 * x + 12 * y + 3;
	return [4 * x / denom, 9 * y / denom];
}

export function XYZ_to_uv(XYZ: color): [number, number] {
	// Convert an array of three XYZ values
	// to u*,v* chromaticity coordinates

	const X = XYZ[0];
	const Y = XYZ[1];
	const Z = XYZ[2];
	const denom = X + 15 * Y + 3 * Z;
	return [4 * X / denom, 9 * Y / denom];
}
