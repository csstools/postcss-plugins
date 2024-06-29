/* eslint-disable no-loss-of-precision */

import type { Color } from '../types/color';
import { Matrix, multiplyMatrices } from '../calculations/multiply-matrices';

const M: Matrix = [
	1.34578688164715830, -0.25557208737979464, -0.05110186497554526,
	-0.54463070512490190, 1.50824774284514680, 0.02052744743642139,
	0.00000000000000000, 0.00000000000000000, 1.21196754563894520,
];

/**
 * Convert D50 XYZ to linear-light prophoto-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function XYZ_to_lin_ProPhoto(XYZ: Color): Color {
	return multiplyMatrices(M, XYZ);
}
