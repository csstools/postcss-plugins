import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * XYZ <-> LMS matrices recalculated for consistent reference white
 * @see https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484
 */
export function XYZ_to_OKLab(XYZ: Color): Color {
	// Given XYZ relative to D65, convert to OKLab
	const XYZtoLMS = [
		[0.8190224432164319, 0.3619062562801221, -0.12887378261216414],
		[0.0329836671980271, 0.9292868468965546, 0.03614466816999844],
		[0.048177199566046255, 0.26423952494422764, 0.6335478258136937],
	];
	const LMStoOKLab = [
		[0.2104542553, 0.7936177850, -0.0040720468],
		[1.9779984951, -2.4285922050, 0.4505937099],
		[0.0259040371, 0.7827717662, -0.8086757660],
	];

	const LMS = multiplyMatrices(XYZtoLMS, XYZ) as Color;
	return multiplyMatrices(LMStoOKLab, LMS.map(c => Math.cbrt(c))) as Color;
	// L in range [0,1]. For use in CSS, multiply by 100 and add a percent
}
