import type { Color } from '../types/color';
import type { Matrix} from '../calculations/multiply-matrices';
import { multiplyMatrices } from '../calculations/multiply-matrices';

const M: Matrix = [
	506752 / 1228815, 87881 / 245763, 12673 / 70218,
	87098 / 409605, 175762 / 245763, 12673 / 175545,
	7918 / 409605, 87881 / 737289, 1001167 / 1053270,
];

/**
 * Convert an array of linear-light sRGB values to CIE XYZ
 * using sRGB's own white, D65 (no chromatic adaptation)
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function lin_sRGB_to_XYZ(rgb: Color): Color {
	return multiplyMatrices(M, rgb);
}
