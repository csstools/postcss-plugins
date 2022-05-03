import { multiplyMatrices } from 'calculations/multiply-matrices';

/**
 * Convert an array of linear-light a98-rgb values to CIE XYZ
 * http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 * has greater numerical precision than section 4.3.5.3 of
 * https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
 * but the values below were calculated from first principles
 * from the chromaticity coordinates of R G B W
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 * @see https://www.adobe.com/digitalimag/pdfs/AdobeRGB1998.pdf
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/matrixmaker.html
 */
export function lin_a98rgb_to_XYZ(rgb: Color): Color {
	const M = [
		[0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
		[0.29734497525053605, 0.6273635662554661, 0.07529145849399788],
		[0.02703136138641234, 0.07068885253582723, 0.9913375368376388],
	];

	return multiplyMatrices(M, rgb) as Color;
}
