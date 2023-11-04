import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Bradford chromatic adaptation from D50 to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function D50_to_D65(XYZ: Color): Color {
	const M = [
		[0.9554734527042182, -0.023098536874261423, 0.0632593086610217],
		[-0.028369706963208136, 1.0099954580058226, 0.021041398966943008],
		[0.012314001688319899, -0.020507696433477912, 1.3303659366080753],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
