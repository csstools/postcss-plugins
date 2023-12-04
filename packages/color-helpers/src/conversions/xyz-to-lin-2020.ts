import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Convert XYZ to linear-light rec2020
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_lin_2020(XYZ: Color): Color {
	const M = [
		[30757411 / 17917100, -6372589 / 17917100, -4539589 / 17917100],
		[-19765991 / 29648200, 47925759 / 29648200, 467509 / 29648200],
		[792561 / 44930125, -1921689 / 44930125, 42328811 / 44930125],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
