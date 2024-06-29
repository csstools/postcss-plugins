import type { Color } from '../types/color';
import { Matrix, multiplyMatrices } from '../calculations/multiply-matrices';

const M: Matrix = [
	573536 / 994567, 263643 / 1420810, 187206 / 994567,
	591459 / 1989134, 6239551 / 9945670, 374412 / 4972835,
	53769 / 1989134, 351524 / 4972835, 4929758 / 4972835,
];

/**
 * Convert an array of linear-light a98-rgb values to CIE XYZ
 * http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 * has greater numerical precision than section 4.3.5.3 of
 * https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
 * but the values below were calculated from first principles
 * from the chromaticity coordinates of R G B W
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 * @see https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/matrixmaker.html
 */
export function lin_a98rgb_to_XYZ(rgb: Color): Color {
	return multiplyMatrices(M, rgb);
}
