/**
 * Convert an array of a98-rgb values in the range 0.0 - 1.0
 * to linear light (un-companded) form. Negative values are also now accepted
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function lin_a98rgb(RGB: Color): Color {
	return RGB.map(function (val) {
		const sign = val < 0 ? -1 : 1;
		const abs = Math.abs(val);

		return sign * Math.pow(abs, 563 / 256);
	}) as Color;
}
