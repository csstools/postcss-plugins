import { multiplyMatrices } from 'calculations/multiply-matrices';

/**
 * Convert XYZ to linear-light a98-rgb
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_lin_a98rgb(XYZ: Color): Color {
	const M = [
		[2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
		[-0.9692436362808795, 1.8759675015077202, 0.04155505740717557],
		[0.013444280632031142, -0.11836239223101838, 1.0151749943912054],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
