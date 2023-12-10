import type { Color } from '../types/color';

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */

export function OKLCH_to_OKLab(OKLCH: Color): Color {
	return [
		OKLCH[0], // L is still L
		OKLCH[1] * Math.cos(OKLCH[2] * Math.PI / 180), // a
		OKLCH[1] * Math.sin(OKLCH[2] * Math.PI / 180),  // b
	];
}
