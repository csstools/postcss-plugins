import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Bradford chromatic adaptation from D50 to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function D50_to_D65(XYZ: Color): Color {
	const M = [
		[0.955473421488075, -0.02309845494876471, 0.06325924320057072],
		[-0.0283697093338637, 1.0099953980813041, 0.021041441191917323],
		[0.012314014864481998, -0.020507649298898964, 1.330365926242124],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
