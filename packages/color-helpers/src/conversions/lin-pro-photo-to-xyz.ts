/* eslint-disable no-loss-of-precision */

import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Convert an array of linear-light prophoto-rgb values to CIE D50 XYZ.
 * Matrix cannot be expressed in rational form, but is calculated to 64 bit accuracy.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see see https://github.com/w3c/csswg-drafts/issues/7675
 */
export function lin_ProPhoto_to_XYZ(rgb: Color): Color {
	const M = [
		[0.79776664490064230, 0.13518129740053308, 0.03134773412839220],
		[0.28807482881940130, 0.71183523424187300, 0.00008993693872564],
		[0.00000000000000000, 0.00000000000000000, 0.82510460251046020],
	];

	return multiplyMatrices(M, rgb) as Color;
}
