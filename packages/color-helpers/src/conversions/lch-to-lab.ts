import type { Color } from '../types/color';

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function LCH_to_Lab(LCH: Color, missingHue: boolean = false): Color {
	const h = LCH[2] * Math.PI / 180;

	// Convert from polar form
	return [
		LCH[0], // L is still L
		missingHue ? 0 : LCH[1] * Math.cos(h), // a
		missingHue ? 0 : LCH[1] * Math.sin(h), // b
	];
}
