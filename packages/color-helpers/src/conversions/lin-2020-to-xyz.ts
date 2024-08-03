import type { Color } from '../types/color';
import type { Matrix} from '../calculations/multiply-matrices';
import { multiplyMatrices } from '../calculations/multiply-matrices';

const M: Matrix = [
	63426534 / 99577255, 20160776 / 139408157, 47086771 / 278816314,
	26158966 / 99577255, 472592308 / 697040785, 8267143 / 139408157,
	0 / 1, 19567812 / 697040785, 295819943 / 278816314,
];

/**
 * Convert an array of linear-light rec2020 values to CIE XYZ
 * using  D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function lin_2020_to_XYZ(rgb: Color): Color {
	// 0 is actually calculated as 4.994106574466076e-17
	return multiplyMatrices(M, rgb);
}
