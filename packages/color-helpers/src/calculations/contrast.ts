/**
 * Return WCAG 2.1 contrast ratio for two sRGB values given as arrays
 *
 * of 0.0 to 1.0
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 *
 * @see https://github.com/w3c/csswg-drafts/blob/main/css-color-4/utilities.js
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
import { sRGB_to_luminance } from '../conversions/srgb-to-luminance';
import type { Color } from '../types/color';

export function contrast(RGB1: Color, RGB2: Color): number {
	const L1 = sRGB_to_luminance(RGB1);
	const L2 = sRGB_to_luminance(RGB2);

	if (L1 > L2) {
		return (L1 + 0.05) / (L2 + 0.05);
	}

	return (L2 + 0.05) / (L1 + 0.05);
}
