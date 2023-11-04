import type { Color } from '../types/color';

/**
 * Given OKLab, convert to XYZ relative to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */
import { multiplyMatrices } from '../calculations/multiply-matrices';

export function OKLab_to_XYZ(OKLab: Color): Color {
	const LMStoXYZ = [
		[1.2268798733741557, -0.5578149965554813, 0.28139105017721583],
		[-0.04057576262431372, 1.1122868293970594, -0.07171106666151701],
		[-0.07637294974672142, -0.4214933239627914, 1.5869240244272418],
	];
	const OKLabtoLMS = [
		[0.99999999845051981432, 0.39633779217376785678, 0.21580375806075880339],
		[1.0000000088817607767, -0.1055613423236563494, -0.063854174771705903402],
		[1.0000000546724109177, -0.089484182094965759684, -1.2914855378640917399],
	];

	const LMSnl = multiplyMatrices(OKLabtoLMS, OKLab) as Color;

	return multiplyMatrices(LMStoXYZ, LMSnl.map(c => c ** 3)) as Color;
}
