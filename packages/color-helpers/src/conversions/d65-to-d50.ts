import type { Color } from '../types/color';
import { multiplyMatrices } from '../calculations/multiply-matrices';

/**
 * Bradford chromatic adaptation from D65 to D50
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
 */
export function D65_to_D50(XYZ: Color): Color {
	// The matrix below is the result of three operations:
	// - convert from XYZ to retinal cone domain
	// - scale components from one reference white to another
	// - convert back to XYZ
	const M = [
		[1.0479298208405488, 0.022946793341019088, -0.05019222954313557],
		[0.029627815688159344, 0.990434484573249, -0.01707382502938514],
		[-0.009243058152591178, 0.015055144896577895, 0.7518742899580008],
	];

	return multiplyMatrices(M, XYZ) as Color;
}
