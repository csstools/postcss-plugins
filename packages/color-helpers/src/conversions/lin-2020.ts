import type { Color } from '../types/color';

/**
 * Convert an array of rec2020 RGB values in the range 0.0 - 1.0
 * to linear light (un-companded) form.
 * Reference electro-optical transfer function from Rec. ITU-R BT.1886 Annex 1
 * with b (black lift) = 0 and a (user gain) = 1
 * defined over the extended range, not clamped
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function lin_2020(RGB: Color): Color {
	return [
		lin_2020_channel(RGB[0]),
		lin_2020_channel(RGB[1]),
		lin_2020_channel(RGB[2]),
	];
}

function lin_2020_channel(val: number): number {
	const sign = val < 0 ? -1 : 1;
	const abs = Math.abs(val);

	return sign * Math.pow(abs, 2.4);
}
