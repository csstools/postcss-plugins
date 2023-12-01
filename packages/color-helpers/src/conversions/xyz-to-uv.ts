import type { Color } from '../types/color';

/**
 * Convert an array of three XYZ values to u*,v* chromaticity coordinates
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
export function XYZ_to_uv(XYZ: Color): [number, number] {
	const X = XYZ[0];
	const Y = XYZ[1];
	const Z = XYZ[2];
	const denom = X + 15 * Y + 3 * Z;
	return [4 * X / denom, 9 * Y / denom];
}
