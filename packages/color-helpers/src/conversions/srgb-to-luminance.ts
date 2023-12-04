import type { Color } from '../types/color';
import { lin_sRGB } from '../conversions/lin-srgb';
import { lin_sRGB_to_XYZ } from '../conversions/lin-srgb-to-xyz';

/**
 * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range
 * to linear-light sRGB, then to CIE XYZ and return luminance (the Y value)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
export function sRGB_to_luminance(RGB: Color): number {
	const XYZ = lin_sRGB_to_XYZ(lin_sRGB(RGB));
	return XYZ[1];
}
