import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Convert XYZ to linear-light a98-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_lin_a98rgb(XYZ: Color): Color {
	const M = [
		[1829569 / 896150, -506331 / 896150, -308931 / 896150],
		[-851781 / 878810, 1648619 / 878810, 36519 / 878810],
		[16779 / 1248040, -147721 / 1248040, 1266979 / 1248040],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
