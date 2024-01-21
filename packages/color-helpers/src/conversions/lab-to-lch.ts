import type { Color } from '../types/color';

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function Lab_to_LCH(Lab: Color): Color {
	// Convert to polar form
	const hue = Math.atan2(Lab[2], Lab[1]) * 180 / Math.PI;
	return [
		Lab[0], // L is still L
		Math.sqrt(Math.pow(Lab[1], 2) + Math.pow(Lab[2], 2)), // Chroma
		hue >= 0 ? hue : hue + 360, // Hue, in degrees [0 to 360)
	];
}
