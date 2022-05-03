import { multiplyMatrices } from 'calculations/multiply-matrices';

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
		[0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
		[0.2289745640697488, 0.6917385218365064, 0.079286914093745],
		[0.0000000000000000, 0.04511338185890264, 1.043944368900976],
	];
	// 0 was computed as -3.972075516933488e-17

	return multiplyMatrices(M, rgb) as Color;
}
