import type { Color } from '../types/color';
import { HSL_to_sRGB } from './hsl-to-srgb';

/**
 * @param {number} hue -  Hue as degrees 0..360
 * @param {number} white -  Whiteness as percentage 0..100
 * @param {number} black -  Blackness as percentage 0..100
 * @return {number[]} Array of RGB components 0..1
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hwbToRgb.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hwbToRgb.js
 */
export function HWB_to_sRGB(HWB: Color): Color {
	const hue = HWB[0];
	const white = HWB[1] / 100;
	const black = HWB[2] / 100;

	if (white + black >= 1) {
		const gray = white / (white + black);
		return [gray, gray, gray];
	}

	const rgb = HSL_to_sRGB([hue, 100, 50]);
	const l = (1 - white - black);

	return [
		(rgb[0] * l) + white,
		(rgb[1] * l) + white,
		(rgb[2] * l) + white,
	]
}
