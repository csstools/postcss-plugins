import type { Color } from '../types/color';

/**
 * Convert an array of gamma-corrected sRGB values in the 0.0 to 1.0 range to HSL.
 *
 * @param {Color} RGB [r, g, b]
 * - Red component 0..1
 * - Green component 0..1
 * - Blue component 0..1
 * @return {number[]} Array of HSL values: Hue as degrees 0..360, Saturation and Lightness as percentages 0..100
 *
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/better-rgbToHsl.js
 */
export function sRGB_to_HSL(RGB: Color): Color {
	const red = RGB[0];
	const green = RGB[1];
	const blue = RGB[2];

	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const light = (min + max) / 2;
	const d = max - min;

	let hue = NaN;
	let sat = 0;

	if (Math.round(d * 100_000) !== 0) {
		const light_00_000 = Math.round(light * 100_000);

		if (light_00_000 === 0 || light_00_000 === 100_000) {
			sat = 0;
		} else {
			sat = (max - light) / Math.min(light, 1 - light);
		}

		switch (max) {
			case red:
				hue = (green - blue) / d + (green < blue ? 6 : 0);
				break;
			case green:
				hue = (blue - red) / d + 2;
				break;
			case blue:
				hue = (red - green) / d + 4;
				break;
		}

		hue = hue * 60;
	}

	// Very out of gamut colors can produce negative saturation
	// If so, just rotate the hue by 180 and use a positive saturation
	// see https://github.com/w3c/csswg-drafts/issues/9222
	if (sat < 0) {
		hue += 180;
		sat = Math.abs(sat);
	}

	if (hue >= 360) {
		hue -= 360;
	}

	return [
		hue,
		sat * 100,
		light * 100
	];
}
