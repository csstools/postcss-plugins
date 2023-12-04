import type { Color } from '../types/color';

/**
 * Assuming XYZ is relative to D50, convert to CIE Lab
 * from CIE standard, which now defines these as a rational fraction
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
import { D50 } from '../conversions/constants';

export function XYZ_to_Lab(XYZ: Color): Color {
	const ε = 216 / 24389;  // 6^3/29^3
	const κ = 24389 / 27;   // 29^3/3^3

	// compute xyz, which is XYZ scaled relative to reference white
	const xyz = XYZ.map((value, i) => value / D50[i]);

	// now compute f
	const f = xyz.map(value => value > ε ? Math.cbrt(value) : (κ * value + 16) / 116);

	return [
		(116 * f[1]) - 16, 	 // L
		500 * (f[0] - f[1]), // a
		200 * (f[1] - f[2]),  // b
	];
	// L in range [0,100]. For use in CSS, add a percent
}
