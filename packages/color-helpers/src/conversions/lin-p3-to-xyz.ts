import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Convert an array of linear-light display-p3 values to CIE XYZ
 * using D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function lin_P3_to_XYZ(rgb: Color): Color {
	const M = [
		[608311 / 1250200, 189793 / 714400, 198249 / 1000160],
		[35783 / 156275, 247089 / 357200, 198249 / 2500400],
		[0 / 1, 32229 / 714400, 5220557 / 5000800],
	];

	return multiplyMatrices(M, rgb) as Color;
}
