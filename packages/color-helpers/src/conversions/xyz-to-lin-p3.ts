import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Convert XYZ to linear-light P3
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_lin_P3(XYZ: Color): Color {
	const M = [
		[446124 / 178915, -333277 / 357830, -72051 / 178915],
		[-14852 / 17905, 63121 / 35810, 423 / 17905],
		[11844 / 330415, -50337 / 660830, 316169 / 330415],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
