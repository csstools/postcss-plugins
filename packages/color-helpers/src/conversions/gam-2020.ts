import type { Color } from '../types/color';

/**
 * Convert an array of linear-light rec2020 RGB  in the range 0.0-1.0
 * to gamma corrected form ITU-R BT.2020-2 p.4
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function gam_2020(RGB: Color): Color {
	return [
		gam_2020_channel(RGB[0]),
		gam_2020_channel(RGB[1]),
		gam_2020_channel(RGB[2]),
	]
}

const α = 1.09929682680944;
const β = 0.018053968510807;

function gam_2020_channel(val: number): number {
	const sign = val < 0 ? -1 : 1;
	const abs = Math.abs(val);

	if (abs > β) {
		return sign * (α * Math.pow(abs, 0.45) - (α - 1));
	}

	return 4.5 * val;
}
