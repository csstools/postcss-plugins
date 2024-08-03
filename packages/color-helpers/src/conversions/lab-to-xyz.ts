import type { Color } from '../types/color';
import { D50 } from '../conversions/constants';

/**
 * Convert Lab to D50-adapted XYZ
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function Lab_to_XYZ(Lab: Color): Color {
	const κ = 24389 / 27;   // 29^3/3^3
	const ε = 216 / 24389;  // 6^3/29^3

	// compute f, starting with the luminance-related term
	const f1 = (Lab[0] + 16) / 116;
	const f0 = Lab[1] / 500 + f1;
	const f2 = f1 - Lab[2] / 200;

	// compute xyz
	return [
		(Math.pow(f0, 3) > ε ? Math.pow(f0, 3) : (116 * f0 - 16) / κ) * D50[0],
		(Lab[0] > κ * ε ? Math.pow((Lab[0] + 16) / 116, 3) : Lab[0] / κ) * D50[1],
		(Math.pow(f2, 3) > ε ? Math.pow(f2, 3) : (116 * f2 - 16) / κ) * D50[2],
	];
}
