import type { Color } from '../types/color';

/**
 * Convert an array of rec2020 RGB values in the range 0.0 - 1.0
 * to linear light (un-companded) form.
 * ITU-R BT.2020-2 p.4
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function lin_2020(RGB: Color): Color {
	const α = 1.09929682680944;
	const β = 0.018053968510807;

	return RGB.map(function (val) {
		const sign = val < 0 ? -1 : 1;
		const abs = Math.abs(val);

		if (abs < β * 4.5) {
			return val / 4.5;
		}

		return sign * (Math.pow((abs + α - 1) / α, 1 / 0.45));
	}) as Color;
}
