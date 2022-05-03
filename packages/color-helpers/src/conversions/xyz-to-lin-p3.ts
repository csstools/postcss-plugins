import { multiplyMatrices } from 'calculations/multiply-matrices';

/**
 * Convert XYZ to linear-light P3
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_lin_P3(XYZ: Color): Color {
	const M = [
		[2.493496911941425, -0.9313836179191239, -0.40271078445071684],
		[-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
		[0.03584583024378447, -0.07617238926804182, 0.9568845240076872],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
