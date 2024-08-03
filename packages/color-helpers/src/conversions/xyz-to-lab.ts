import type { Color } from '../types/color';
import { D50 } from '../conversions/constants';

/**
 * Assuming XYZ is relative to D50, convert to CIE Lab
 * from CIE standard, which now defines these as a rational fraction
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_Lab(XYZ: Color): Color {
	const f0 = compute_f(XYZ[0] / D50[0]);
	const f1 = compute_f(XYZ[1] / D50[1]);
	const f2 = compute_f(XYZ[2] / D50[2]);

	return [
		(116 * f1) - 16, // L
		500 * (f0 - f1), // a
		200 * (f1 - f2), // b
	];
	// L in range [0,100]. For use in CSS, add a percent
}

const ε = 216 / 24389;  // 6^3/29^3
const κ = 24389 / 27;   // 29^3/3^3

function compute_f(val: number): number {
	return val > ε ? Math.cbrt(val) : (κ * val + 16) / 116
}
