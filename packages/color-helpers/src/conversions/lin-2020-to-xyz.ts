import { multiplyMatrices } from 'calculations/multiply-matrices';

/**
 * Convert an array of linear-light rec2020 values to CIE XYZ
 * using  D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function lin_2020_to_XYZ(rgb: Color): Color {
	const M = [
		[0.6369580483012914, 0.14461690358620832, 0.1688809751641721],
		[0.2627002120112671, 0.6779980715188708, 0.05930171646986196],
		[0.000000000000000, 0.028072693049087428, 1.060985057710791],
	];
	// 0 is actually calculated as 4.994106574466076e-17

	return multiplyMatrices(M, rgb) as Color;
}
