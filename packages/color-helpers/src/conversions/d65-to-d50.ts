import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Bradford chromatic adaptation from D65 to D50
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
 */
export function D65_to_D50(XYZ: Color): Color {
	// The matrix below is the result of three operations:
	// - convert from XYZ to retinal cone domain
	// - scale components from one reference white to another
	// - convert back to XYZ
	const M = [
		[1.0479297925449969, 0.022946870601609652, -0.05019226628920524],
		[0.02962780877005599, 0.9904344267538799, -0.017073799063418826],
		[-0.009243040646204504, 0.015055191490298152, 0.7518742814281371],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
