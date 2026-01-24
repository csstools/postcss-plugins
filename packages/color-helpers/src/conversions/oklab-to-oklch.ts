import type { Color } from '../types/color';

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js
 */
export function OKLab_to_OKLCH(OKLab: Color): Color {
	const epsilon = 0.000004;
	const chroma = Math.sqrt(OKLab[1] ** 2 + OKLab[2] ** 2);

	let hue = Math.atan2(OKLab[2], OKLab[1]) * 180 / Math.PI;
	if (hue < 0) {
		hue = hue + 360;
	}

	if (chroma <= epsilon) {
		hue = NaN;
	}

	return [
		OKLab[0], // L is still L
		chroma,
		hue
	];
}
