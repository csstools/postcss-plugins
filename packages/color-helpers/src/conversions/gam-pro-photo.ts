import type { Color } from '../types/color';

/**
 * Convert an array of linear-light prophoto-rgb in the range 0.0-1.0
 * to gamma corrected form.
 * Transfer curve is gamma 1.8 with a small linear portion.
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/conversions.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function gam_ProPhoto(RGB: Color): Color {
	// TODO for negative values, extend linear portion on reflection of axis, then add pow below that

	return [
		gam_ProPhoto_channel(RGB[0]),
		gam_ProPhoto_channel(RGB[1]),
		gam_ProPhoto_channel(RGB[2]),
	];
}

const Et = 1 / 512;

function gam_ProPhoto_channel(val: number): number {
	const sign = val < 0 ? -1 : 1;
	const abs = Math.abs(val);

	if (abs >= Et) {
		return sign * Math.pow(abs, 1 / 1.8);
	}

	return 16 * val;
}
