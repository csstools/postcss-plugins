import type { Color } from '../types/color';

/**
 * CMYK is an array of four values in the range [0.0, 1.0] the output is an
 * array of [RGB] also in the [0.0, 1.0] range because the naive algorithm
 * does not generate out of gamut colors neither does it generate accurate
 * simulations of practical CMYK colors
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 */
export function naive_CMYK_to_sRGB(CMYK: [number, number, number, number]): Color {
	const cyan = CMYK[0], magenta = CMYK[1], yellow = CMYK[2], black = CMYK[3];

	const red = 1 - Math.min(1, cyan * (1 - black) + black);
	const green = 1 - Math.min(1, magenta * (1 - black) + black);
	const blue = 1 - Math.min(1, yellow * (1 - black) + black);

	return [red, green, blue];
}
