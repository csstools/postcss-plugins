import type { Color } from '../types/color';

/**
 * @param {number} hue - Hue as degrees 0..360
 * @param {number} sat - Saturation as percentage 0..100
 * @param {number} light - Lightness as percentage 0..100
 * @return {number[]} Array of sRGB components; in-gamut colors in range [0..1]
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hslToRgb.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/hslToRgb.js
 */
export function HSL_to_sRGB(HSL: Color): Color {
	let hue = HSL[0] % 360;
	const sat = HSL[1] / 100;
	const light = HSL[2] / 100;

	if (hue < 0) {
		hue =  hue + 360;
	}

	return [
		HSL_to_sRGB_channel(0, hue, sat, light),
		HSL_to_sRGB_channel(8, hue, sat, light),
		HSL_to_sRGB_channel(4, hue, sat, light)
	];
}

function HSL_to_sRGB_channel(n: number, hue: number, sat: number, light: number): number {
	const k = (n + hue / 30) % 12;
	const a = sat * Math.min(light, 1 - light);
	return light - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
}
