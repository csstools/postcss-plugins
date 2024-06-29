import type { Color } from '../types/color';
import { Matrix, multiplyMatrices } from '../calculations/multiply-matrices';

const XYZtoLMS: Matrix = [
	0.8190224379967030, 0.3619062600528904, -0.1288737815209879,
	0.0329836539323885, 0.9292868615863434, 0.0361446663506424,
	0.0481771893596242, 0.2642395317527308, 0.6335478284694309,
];
const LMStoOKLab: Matrix = [
	0.2104542683093140, 0.7936177747023054, -0.0040720430116193,
	1.9779985324311684, -2.4285922420485799, 0.4505937096174110,
	0.0259040424655478, 0.7827717124575296, -0.8086757549230774,
];

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * XYZ <-> LMS matrices recalculated for consistent reference white
 * @see https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484
 */
export function XYZ_to_OKLab(XYZ: Color): Color {
	// Given XYZ relative to D65, convert to OKLab
	const LMS = multiplyMatrices(XYZtoLMS, XYZ);

	return multiplyMatrices(
		LMStoOKLab,
		[
			Math.cbrt(LMS[0]),
			Math.cbrt(LMS[1]),
			Math.cbrt(LMS[2]),
		],
	);
	// L in range [0,1]. For use in CSS, multiply by 100 and add a percent
}
