import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Convert an array of linear-light prophoto-rgb values to CIE XYZ
 * using D50 (so no chromatic adaptation needed afterwards)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function lin_ProPhoto_to_XYZ(rgb: Color): Color {
	const M = [
		[0.7977604896723027, 0.13518583717574031, 0.0313493495815248],
		[0.2880711282292934, 0.7118432178101014, 0.00008565396060525902],
		[0.0, 0.0, 0.8251046025104601],
	];

	return multiplyMatrices(M, rgb) as Color;
}
