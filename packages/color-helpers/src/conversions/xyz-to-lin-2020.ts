import { multiplyMatrices } from 'calculations/multiply-matrices';

/**
 * Convert XYZ to linear-light rec2020
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_lin_2020(XYZ: Color): Color {
	const M = [
		[1.7166511879712674, -0.35567078377639233, -0.25336628137365974],
		[-0.6666843518324892, 1.6164812366349395, 0.01576854581391113],
		[0.017639857445310783, -0.042770613257808524, 0.9421031212354738],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
