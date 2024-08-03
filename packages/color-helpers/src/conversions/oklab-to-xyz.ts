import type { Color } from '../types/color';
import type { Matrix} from '../calculations/multiply-matrices';
import { multiplyMatrices } from '../calculations/multiply-matrices';

const LMStoXYZ: Matrix = [
	1.2268798758459243, -0.5578149944602171, 0.2813910456659647,
	-0.0405757452148008, 1.1122868032803170, -0.0717110580655164,
	-0.0763729366746601, -0.4214933324022432, 1.5869240198367816,
];
const OKLabtoLMS: Matrix = [
	1.0000000000000000, 0.3963377773761749, 0.2158037573099136,
	1.0000000000000000, -0.1055613458156586, -0.0638541728258133,
	1.0000000000000000, -0.0894841775298119, -1.2914855480194092,
];

/**
 * Given OKLab, convert to XYZ relative to D65
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */
export function OKLab_to_XYZ(OKLab: Color): Color {
	const LMSnl = multiplyMatrices(OKLabtoLMS, OKLab);

	return multiplyMatrices(
		LMStoXYZ,
		[
			LMSnl[0] ** 3,
			LMSnl[1] ** 3,
			LMSnl[2] ** 3,
		],
	);
}
