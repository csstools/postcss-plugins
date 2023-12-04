import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Convert XYZ to linear-light prophoto-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function XYZ_to_lin_ProPhoto(XYZ: Color): Color {
	const M = [
		[1.3457989731028281, -0.25558010007997534, -0.05110628506753401],
		[-0.5446224939028347, 1.5082327413132781, 0.02053603239147973],
		[0.0, 0.0, 1.2119675456389454],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
