import type { Color } from '../types/color';

/**
 * @license W3C https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * @copyright This software or document includes material copied from or derived from https://github.com/w3c/csswg-drafts/blob/main/css-color-4/map-gamut.js. Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang).
 */
export function clip(color: Color): Color {
	return color.map(val => {
		if (val < 0) {
			return 0;
		} else if (val > 1) {
			return 1;
		} else {
			return val;
		}
	}) as Color;
}
