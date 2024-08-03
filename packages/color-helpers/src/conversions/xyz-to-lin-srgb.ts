import type { Color } from '../types/color';
import type { Matrix} from '../calculations/multiply-matrices';
import { multiplyMatrices } from '../calculations/multiply-matrices';

const M: Matrix = [
	12831 / 3959, -329 / 214, -1974 / 3959,
	-851781 / 878810, 1648619 / 878810, 36519 / 878810,
	705 / 12673, -2585 / 12673, 705 / 667,
];

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function XYZ_to_lin_sRGB(XYZ: Color): Color {
	return multiplyMatrices(M, XYZ);
}
